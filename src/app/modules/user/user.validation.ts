import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    bio: z.string().optional(),
    languages: z.array(z.string()).optional(),
  }),
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
