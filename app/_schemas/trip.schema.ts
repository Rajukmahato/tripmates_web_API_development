import { z } from "zod";

export const createTripSchema = z.object({
  // ===== REQUIRED FIELDS =====
  destination: z
    .string()
    .min(3, "Destination must be at least 3 characters")
    .max(100, "Destination is too long")
    .optional(),
  destinationId: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid destination ID format",
    }),
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
  
  // ===== BASIC OPTIONAL FIELDS =====
  travelType: z
    .enum(["adventure", "leisure", "business", "backpacking", "cultural"])
    .optional(),
  groupSize: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 50),
      {
        message: "Group size must be between 1 and 50",
      }
    ),
  
  // ===== ENHANCED TRIP DETAILS (OPTIONAL) =====
  // Distance & Duration
  distanceMin: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Distance must be a number" }
  ),
  distanceMax: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Distance must be a number" }
  ),
  distanceUnit: z.string().optional(),
  durationMinHours: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Duration must be a number" }
  ),
  durationMaxHours: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Duration must be a number" }
  ),
  
  // Difficulty & Skill
  difficulty: z
    .enum(["Easy", "Moderate", "Hard", "Expert", "Extreme"])
    .optional(),
  physicalDemand: z
    .enum(["Light", "Moderate", "Strenuous", "Very Strenuous"])
    .optional(),
  skilLevelRequired: z
    .enum(["Beginner", "Intermediate", "Advanced", "Expert"])
    .optional(),
  
  // Group Size Ranges
  groupSizeMin: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Group size must be a number" }
  ),
  groupSizeMax: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Group size must be a number" }
  ),
  
  // Elevation
  elevationMin: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Elevation must be a number" }
  ),
  elevationMax: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)),
    { message: "Elevation must be a number" }
  ),
  elevationUnit: z.string().optional(),
  
  // Season & Activities
  bestSeason: z
    .enum(["Spring", "Summer", "Fall", "Winter", "Year-round"])
    .optional(),
  activities: z.string().optional(), // Comma-separated or JSON
  
  // Inclusions
  guideIncluded: z.boolean().optional(),
  mealsIncluded: z.boolean().optional(),
  accommodationType: z.string().optional(),
  
  // Highlights
  highlights: z.string().optional(), // Comma-separated
  
  // Media
  image: z.string().optional(),
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
).refine(
  (data) => {
    return !!(data.destinationId || data.destination);
  },
  {
    message: "Either destination or a valid destination from the list is required",
    path: ["destination"],
  }
);

export type CreateTripFormData = z.infer<typeof createTripSchema>;
