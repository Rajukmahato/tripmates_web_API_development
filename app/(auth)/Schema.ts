import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type LoginType = z.infer<typeof loginSchema>;
