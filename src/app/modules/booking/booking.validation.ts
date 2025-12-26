import { z } from "zod";

const createBooking = z.object({
  listingId: z.string().uuid(),
  date: z.string().datetime().refine((val) => {
    const selectedDate = new Date(val);
    const now = new Date();
    
    // Set both to midnight if you only care about the day, 
    // or compare directly if you care about the exact hour.
    return selectedDate >= now;
  }, {
    message: "Booking date cannot be in the past",
  }),
  peopleCount: z.number().min(1),
});


const updateBookingStatus = z.object({

    status: z.enum(["CONFIRMED", "CANCELLED"]),
});


export const BookingValidation = {
  createBooking,
  updateBookingStatus,
};
