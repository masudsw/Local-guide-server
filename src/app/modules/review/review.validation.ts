import { z } from "zod";

const createReview = z.object({
    bookingId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
});

export const ReviewValidation = {
  createReview,
};
