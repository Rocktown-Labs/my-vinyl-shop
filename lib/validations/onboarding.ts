import { z } from "zod";

export const accountTypeSchema = z.enum(["collector", "seller", "both"]);

export const onboardingStep1Schema = z.object({
  accountType: accountTypeSchema,
});

export const onboardingStep2Schema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and dashes"
    ),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
});

export const onboardingStep3Schema = z.object({
  location: z.string().max(100).optional(),
  country: z.string().min(1, "Please select your country"),
  genres: z.array(z.string()).min(1, "Please select at least one genre"),
  shipsWorldwide: z.boolean().default(false),
});

export const onboardingStep4Schema = z.object({
  subscriptionTier: z.string().nullable().optional(),
});

export const onboardingStep5Schema = z.object({
  stripeAccountId: z.string().nullable().optional(),
});

// Combined schema for final submission
export const onboardingCompleteSchema = z.object({
  accountType: accountTypeSchema,
  displayName: z.string().min(1),
  username: z.string().min(3),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  country: z.string().min(1),
  genres: z.array(z.string()).min(1),
  shipsWorldwide: z.boolean(),
  subscriptionTier: z.string().nullable().optional(),
  stripeAccountId: z.string().nullable().optional(),
});

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>;
export type OnboardingStep5Data = z.infer<typeof onboardingStep5Schema>;
export type OnboardingCompleteData = z.infer<typeof onboardingCompleteSchema>;
