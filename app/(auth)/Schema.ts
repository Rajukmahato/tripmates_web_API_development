import z from "zod";


export const registerScheme = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" }),

    phoneNumber: z
      .string()
      .regex(/^[0-9]{10}$/, {
        message: "Phone number must be exactly 10 digits",
      }),

    Password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/[0-9]/, "Password must contain at least one number"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.Password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterType = z.infer<typeof registerScheme>;

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10}$/, {
      message: "Phone number must be exactly 10 digits",
    }),

  Password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type LoginType = z.infer<typeof loginSchema>;
