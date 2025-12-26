import { BookingStatus, PaymentStatus, PrismaClient, Role } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
import { IUserPayload } from "../user/user.interface";

const prisma = new PrismaClient();



const createBooking = async (
  user: IUserPayload,
  payload: {
    listingId: string;
    date: Date;
    peopleCount: number;
  }
) => {
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

    /* ---------- Create booking ---------- */
    const booking = await tx.booking.create({
      data: {
        touristId: user.id,
        listingId,
        date,
        peopleCount,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
      },
    });

    return booking;
  });
};

/* ===============================
   GUIDE ACCEPT / DECLINE
================================ */
const updateBookingStatus = async (
  bookingId: string,
  userId: string,
  role: Role,
  status: BookingStatus
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { listing: true },
  });

  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, "Booking not found");
  }

  /* Only guide owner or admin */
  if (
    role === Role.GUIDE &&
    booking.listing.guideId !== userId
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized");
  }

  return prisma.$transaction(async (tx) => {
    /* ---------- Update booking ---------- */
    const updatedBooking = await tx.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    /* ---------- Create payment when confirmed ---------- */
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

    return updatedBooking;
  });
};

/* ===============================
   COMPLETE TOUR (Guide)
================================ */
const completeBooking = async (
  bookingId: string,
  userId: string
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
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
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        paymentStatus: PaymentStatus.PAID,
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
const getMyBookings = async (userId: string, role: Role) => {
  if (role === Role.TOURIST) {
    return prisma.booking.findMany({
      where: { touristId: userId },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === Role.GUIDE) {
    return prisma.booking.findMany({
      where: {
        listing: { guideId: userId },
      },
      include: { listing: true, tourist: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.booking.findMany({
    include: { listing: true, tourist: true },
  });
};

export const BookingService = {
  createBooking,
  updateBookingStatus,
  completeBooking,
  getMyBookings,
};
