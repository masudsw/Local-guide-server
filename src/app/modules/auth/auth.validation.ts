import { z } from "zod";
import { Role } from "@prisma/client";

const registerUser = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(Role.TOURIST),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  z.object({
    role: z.literal(Role.GUIDE),
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    expertise: z.array(z.string()).min(1),
    dailyRate: z.number().positive(),
  }),
]);

export const AuthValidation={
    registerUser
}
