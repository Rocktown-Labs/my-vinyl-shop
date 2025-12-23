import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface OnboardingProgress {
  currentStep: number;
  accountType: "collector" | "seller" | "both" | null;
  displayName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  location: string;
  country: string;
  genres: string[];
  shipsWorldwide: boolean;
  subscriptionTier: string | null;
  stripeAccountId: string | null;
}

interface OnboardingStore {
  progress: OnboardingProgress;
  setProgress: (progress: Partial<OnboardingProgress>) => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const defaultProgress: OnboardingProgress = {
  currentStep: 1,
  accountType: null,
  displayName: "",
  username: "",
  bio: "",
  avatarUrl: "",
  location: "",
  country: "",
  genres: [],
  shipsWorldwide: false,
  subscriptionTier: null,
  stripeAccountId: null,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      progress: defaultProgress,
      setProgress: (updates) =>
        set((state) => ({
          progress: { ...state.progress, ...updates },
        })),
      setStep: (step) =>
        set((state) => ({
          progress: { ...state.progress, currentStep: step },
        })),
      reset: () => set({ progress: defaultProgress }),
    }),
    {
      name: "onboarding-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
