import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone must be exactly 10 digits")
    .optional()
    .or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
