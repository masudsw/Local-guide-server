import { BookingStatus, PaymentStatus, PrismaClient, Role } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { IUserPayload } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";
import config from "../../../config";
import { stripe } from "../../helper/stripe";

const prisma = new PrismaClient();

const createBooking = async (
  user: IUserPayload,
  payload: {
    listingId: string;
    date: Date;
    peopleCount: number;
  }
) => {
  console.log("üser in booking service", user)
  if (user.role !== Role.TOURIST) {
    throw new ApiError(httpStatus.FORBIDDEN, "Only tourists can book");
  }

  const { listingId, date, peopleCount } = payload;


  return prisma.$transaction(async (tx) => {
    /* ---------- Get listing ---------- */
    const listing = await tx.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
    }

    /* Guide cannot book own listing */
    if (listing.guideId === user.id) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Guide cannot book their own listing"
      );
    }
    if (peopleCount > listing.maxGroup) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `People count exceeds maximum allowed (${listing.maxGroup})`
      );
    }

    const existingBooking = await tx.booking.findFirst({
      where: {
        touristId: user.id,
        listingId,
        date,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (existingBooking) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You already have a booking for this day"
      );
    }


    /* ---------- Create booking ---------- */
    const booking = await tx.booking.create({
      data: {
        touristId: user.id,
        listingId,
        date,
        peopleCount,
        status: BookingStatus.PENDING,
      },
    });

    return booking;
  });
};

/* ===============================
   GUIDE ACCEPT / DECLINE
================================ */
const updateBookingStatus = async (
  user: IUserPayload,
  bookingId: string,
  status: BookingStatus
) => {
  // 1. Include the 'tourist' relation to get their email and name
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { 
      listing: true,
      tourist: true // Needed for email details
    },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  /* Authorization and Guard Clauses */
  if (user.role === Role.GUIDE && booking.listing.guideId !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  const restrictedStatuses = [
    BookingStatus.COMPLETED,
    BookingStatus.CANCELLED,
    BookingStatus.CONFIRMED
  ];

  if ((restrictedStatuses as BookingStatus[]).includes(booking.status)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot update a ${booking.status.toLowerCase()} booking`
    );
  }

  // 2. Perform the database updates
  const updatedBooking = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    if (status === BookingStatus.CONFIRMED) {
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.listing.price,
          transactionId: `TXN-${Date.now()}`,
          status: PaymentStatus.UNPAID,
        },
      });
    }

    return updated;
  });

  // 3. Trigger Email Notification AFTER the transaction is successful
  if (status === BookingStatus.CONFIRMED) {
    // Construct the payment URL (Frontend route)
    const paymentUrl = `${config.client_url}/payment/${booking.id}`;

    // Send email asynchronously (don't 'await' if you don't want to delay the API response)
    sendEmail({
      to: booking.tourist.email,
      subject: "Action Required: Your Booking is Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
          <h2>Hello ${booking.tourist.name},</h2>
          <p>Great news! Your booking for <strong>${booking.listing.title}</strong> has been confirmed by the guide.</p>
          <p>To secure your spot, please complete the payment of <strong>$${booking.listing.price}</strong>.</p>
          <div style="margin: 30px 0;">
            <a href="${paymentUrl}" 
               style="background-color: #6772e5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
               Pay Now
            </a>
          </div>
          <p>If the button doesn't work, copy and paste this link: ${paymentUrl}</p>
          <p>Thank you!</p>
        </div>
      `,
    }).catch((err) => console.error("Email notification failed:", err));
  }

  return updatedBooking;
};

/* ===============================
   COMPLETE TOUR (Guide)
================================ */
const completeBooking = async (
  user: IUserPayload,
  userId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: user.id },
    include: { listing: true, payment: true },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.listing.guideId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  return prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.COMPLETED,
        
      },
    });

    if (booking.payment) {
      await tx.payment.update({
        where: { id: booking.payment.id },
        data: { status: PaymentStatus.PAID },
      });
    }
  });
};

/* ===============================
   GET MY BOOKINGS
================================ */
const getMyBookings = async (user: IUserPayload
) => {
  if (user.role === Role.TOURIST) {
    return prisma.booking.findMany({
      where: { touristId: user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (user.role === Role.GUIDE) {
    return prisma.booking.findMany({
      where: {
        listing: { guideId: user.id },
      },
      include: { listing: true, tourist: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.booking.findMany({
    include: { listing: true, tourist: true },
  });
};

// Example Backend Logic for the "Pay Now" click
const createPaymentSession = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({ 
    where: { id: bookingId },
    include: { listing: true }
  });
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found in database");
  }

  // Create Stripe Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: booking.listing.title },
        unit_amount: booking.listing.price * 100, // Cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    metadata: { bookingId: booking.id }, // Crucial for your Webhook!
    success_url: `${config.client_url}/payment/success`,
    cancel_url: `${config.client_url}/payment/cancel`,
  });

  return session.url;
};

export const BookingService = {
  createBooking,
  updateBookingStatus,
  completeBooking,
  getMyBookings,
  createPaymentSession
};
