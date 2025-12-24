import { z } from "zod";
import { Role } from "@prisma/client";

// const registerUser = z.discriminatedUnion("role", [
//   z.object({
//     role: z.literal(Role.TOURIST),
//     name: z.string(),
//     email: z.email(),
//     password: z.string().min(6),
//   }),
//   z.object({
//     role: z.literal(Role.GUIDE),
//     name: z.string(),
//     email: z.email(),
//     password: z.string().min(6),
//     expertise: z.array(z.string()).min(1),
//     dailyRate: z.number().positive(),
//   }),
// ]);
const registerUserSchema = z.discriminatedUnion("role", [
  z.object({
    role: z.literal(Role.TOURIST),
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  }),
  z.object({
    role: z.literal(Role.GUIDE),
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
    // 1. Handle dailyRate (Coerce string "150" to number 150)
    dailyRate: z.coerce.number().positive(),
    // 2. Expertise often arrives as a stringified JSON from Postman
    expertise: z.preprocess((val) => {
      if (typeof val === 'string') return JSON.parse(val);
      return val;
    }, z.array(z.string()).min(1)),
  }),
]);

export const AuthValidation={
    registerUserSchema
}
