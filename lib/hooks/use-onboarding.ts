"use client";

import { useMutation } from "@tanstack/react-query";

interface CompleteOnboardingParams {
  accountType: "collector" | "seller" | "both";
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  country: string;
  genres: string[];
  shipsWorldwide: boolean;
  subscriptionTier?: string | null;
  stripeAccountId?: string | null;
}

interface CreateStripeAccountResponse {
  accountId: string;
}

interface CreateStripeLinkResponse {
  url: string;
}

interface StripeStatusResponse {
  hasAccount: boolean;
  accountId?: string;
  status?: "pending" | "active";
}

// Complete onboarding
export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: async (data: CompleteOnboardingParams) => {
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to complete onboarding");
      }

      return res.json();
    },
  });
}

// Upload avatar
export function useUploadAvatar() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await res.json();
      return data.url as string;
    },
  });
}

// Create Stripe Connect account
export function useCreateStripeAccount() {
  return useMutation({
    mutationFn: async (): Promise<CreateStripeAccountResponse> => {
      const res = await fetch("/api/stripe/connect/create-account", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to create Stripe account");
      }

      return res.json();
    },
  });
}

// Create Stripe Connect onboarding link
export function useCreateStripeLink() {
  return useMutation({
    mutationFn: async (accountId: string): Promise<CreateStripeLinkResponse> => {
      const res = await fetch("/api/stripe/connect/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId }),
      });

      if (!res.ok) {
        throw new Error("Failed to create Stripe link");
      }

      return res.json();
    },
  });
}

// Check Stripe Connect status
export function useStripeStatus() {
  return useMutation({
    mutationFn: async (): Promise<StripeStatusResponse> => {
      const res = await fetch("/api/stripe/connect/status");

      if (!res.ok) {
        throw new Error("Failed to check Stripe status");
      }

      return res.json();
    },
  });
}

