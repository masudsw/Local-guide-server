import { z } from "zod";
export const updateProfileSchema = z.object({
  name: z.string().optional(),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional(),
  expertise: z.array(z.string()).optional(),
  dailyRate: z.coerce.number().optional(), // Coerce for safety
});

export const getUserByIdSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});
export const UserValidation = {
  updateProfileSchema,
  getUserByIdSchema,
}
