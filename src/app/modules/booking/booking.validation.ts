import { z } from "zod";

const createBooking = z.object({

    listingId: z.string().uuid(),
    date: z.string().datetime(),
  });


const updateBookingStatus = z.object({

    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]),
});

export const BookingValidation = {
  createBooking,
  updateBookingStatus,
};
