import { BookingStatus, PrismaClient, Role } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/apiError";
const prisma = new PrismaClient();

/**
 * Convert "HH:mm" → minutes
 */
const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};


 const createBooking =async (payload: {
    touristId: string;
    listingId: string;
    date: Date;
    startTime: string;
    endTime: string;
    peopleCount: number;
  }) => {
    const {
      touristId,
      listingId,
      date,
      startTime,
      endTime,
      peopleCount,
    } = payload;

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    if (startMin >= endMin) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid time range");
    }

    return await prisma.$transaction(async (tx) => {
      /* ---------------- Get listing & guide ---------------- */
      const listing = await tx.listing.findUnique({
        where: { id: listingId },
      });

      if (!listing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Listing not found");
      }

      const guideId = listing.guideId;

      /* ---------------- Check availability ---------------- */
      const availability = await tx.guideAvailability.findFirst({
        where: {
          guideId,
          date,
          isBooked: false,
        },
      });

      if (!availability) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Guide not available on this date"
        );
      }

      const availStart = timeToMinutes(availability.startTime);
      const availEnd = timeToMinutes(availability.endTime);

      if (startMin < availStart || endMin > availEnd) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Booking time outside guide availability"
        );
      }

      /* ---------------- Price calculation ---------------- */
      const hours = (endMin - startMin) / 60;
      const totalPrice = listing.price * hours * peopleCount;

      /* ---------------- Create booking ---------------- */
      const booking = await tx.booking.create({
        data: {
          touristId,
          listingId,
          date,
          startTime,
          endTime,
          peopleCount,
          totalPrice,
          status: "CONFIRMED",
        },
      });

      /* ---------------- Update availability ---------------- */
      // Remove old availability
      await tx.guideAvailability.delete({
        where: { id: availability.id },
      });

      // Remaining BEFORE booking
      if (availStart < startMin) {
        await tx.guideAvailability.create({
          data: {
            guideId,
            date,
            startTime: availability.startTime,
            endTime: startTime,
          },
        });
      }

      // Remaining AFTER booking
      if (endMin < availEnd) {
        await tx.guideAvailability.create({
          data: {
            guideId,
            date,
            startTime: endTime,
            endTime: availability.endTime,
          },
        });
      }

      return booking;
    });
  },



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
                listing: {
                    guideId: userId,
                },
            },
            include: {
                listing: true,
                tourist: true,
            },
            orderBy: { createdAt: "desc" },
        });
    }

    // ADMIN
    return prisma.booking.findMany({
        include: {
            listing: true,
            tourist: true,
        },
    });
};

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

    // Only guide (owner) or admin can update status
    if (
        role === Role.GUIDE &&
        booking.listing.guideId !== userId
    ) {
        throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized");
    }

    const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
    });

    return updated;
};

export const BookingService = {
    createBooking,
    getMyBookings,
    updateBookingStatus,
};
