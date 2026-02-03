import { z } from "zod";

export const adminCreateUserSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
});

export const adminUpdateUserSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  role: z.enum(["user", "admin"]).optional(),
});

export type AdminCreateUserFormData = z.infer<typeof adminCreateUserSchema>;
export type AdminUpdateUserFormData = z.infer<typeof adminUpdateUserSchema>;
