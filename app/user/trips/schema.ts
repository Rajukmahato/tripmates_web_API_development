import { z } from "zod";

export const createTripSchema = z.object({
  destination: z
    .string()
    .min(3, "Destination must be at least 3 characters")
    .max(100, "Destination is too long"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  budget: z
    .string()
    .min(1, "Budget is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Budget must be a positive number",
    }),
  travelType: z.enum(["adventure", "leisure", "business", "backpacking"], {
    message: "Please select a valid travel type",
  }),
  groupSize: z
    .string()
    .min(1, "Group size is required")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 50,
      {
        message: "Group size must be between 1 and 50",
      }
    ),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  },
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
).refine(
  (data) => {
    const start = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
  },
  {
    message: "Start date must be today or in the future",
    path: ["startDate"],
  }
);

export type CreateTripFormData = z.infer<typeof createTripSchema>;
