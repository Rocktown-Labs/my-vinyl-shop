"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { useForm } from "@tanstack/react-form"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import {
  User,
  Store,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Globe,
  Loader2,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { PricingTable } from "@clerk/nextjs"
import { useOnboardingStore } from "@/lib/stores/onboarding-store"
import {
  onboardingStep1Schema,
  onboardingStep2Schema,
  onboardingStep3Schema,
  type OnboardingCompleteData,
} from "@/lib/validations/onboarding"
import {
  useCompleteOnboarding,
  useUploadAvatar,
  useCreateStripeAccount,
  useCreateStripeLink,
  useStripeStatus,
} from "@/lib/hooks/use-onboarding"

const TOTAL_STEPS = 6

const genres = [
  "Rock",
  "Jazz",
  "Electronic",
  "Hip-Hop",
  "Classical",
  "Soul/R&B",
  "Punk",
  "Metal",
  "Folk",
  "Country",
  "Blues",
  "Reggae",
  "World",
  "Soundtracks",
  "Other",
]

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "Japan",
  "France",
  "Canada",
  "Australia",
  "Netherlands",
  "Italy",
  "Spain",
  "Brazil",
  "Other",
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const { progress, setProgress, setStep, reset } = useOnboardingStore()
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isCreatingStripeAccount, setIsCreatingStripeAccount] = useState(false)

  // React Query mutations
  const completeOnboardingMutation = useCompleteOnboarding()
  const uploadAvatarMutation = useUploadAvatar()
  const createStripeAccountMutation = useCreateStripeAccount()
  const createStripeLinkMutation = useCreateStripeLink()
  const stripeStatusMutation = useStripeStatus()

  const currentStep = progress.currentStep

  // TanStack Form for managing form state
  const form = useForm({
    defaultValues: {
      accountType: progress.accountType as "collector" | "seller" | "both" | null,
      displayName: progress.displayName,
      username: progress.username,
      bio: progress.bio,
      avatarUrl: progress.avatarUrl,
      location: progress.location,
      country: progress.country,
      genres: progress.genres,
      shipsWorldwide: progress.shipsWorldwide,
      subscriptionTier: progress.subscriptionTier,
      stripeAccountId: progress.stripeAccountId,
    },
    onSubmit: async ({ value }) => {
      // This is only called on final step
      await handleCompleteOnboarding(value as OnboardingCompleteData)
    },
  })

  // Sync form with Zustand store
  useEffect(() => {
    form.setFieldValue("accountType", progress.accountType as "collector" | "seller" | "both" | null)
    form.setFieldValue("displayName", progress.displayName)
    form.setFieldValue("username", progress.username)
    form.setFieldValue("bio", progress.bio)
    form.setFieldValue("avatarUrl", progress.avatarUrl)
    form.setFieldValue("location", progress.location)
    form.setFieldValue("country", progress.country)
    form.setFieldValue("genres", progress.genres)
    form.setFieldValue("shipsWorldwide", progress.shipsWorldwide)
    form.setFieldValue("subscriptionTier", progress.subscriptionTier)
    form.setFieldValue("stripeAccountId", progress.stripeAccountId)
  }, [progress, form])

  // Load existing progress and handle Stripe return
  useEffect(() => {
    if (!isLoaded || !user) return

    // Pre-fill from Clerk user if not already set
    if (user.fullName && !progress.displayName) {
      setProgress({ displayName: user.fullName })
    }
    if (user.username && !progress.username) {
      setProgress({ username: user.username })
    }
    if (user.imageUrl && !progress.avatarUrl) {
      setProgress({ avatarUrl: user.imageUrl })
    }

    // Check if returning from Stripe onboarding
    const urlParams = new URLSearchParams(window.location.search)
    const step = urlParams.get("step")
    const refresh = urlParams.get("refresh")

    if (step) {
      setStep(parseInt(step))
    }

    // If returning from Stripe, check account status
    if (step === "6" || refresh === "true") {
      const checkStripeStatus = async () => {
        try {
          const statusData = await stripeStatusMutation.mutateAsync()
          if (statusData.hasAccount) {
            setProgress({ stripeAccountId: statusData.accountId || null })
            if (statusData.status === "pending") {
              // Still needs completion, stay on step 5
              setStep(5)
            }
          }
        } catch (error) {
          console.error("Error checking Stripe status:", error)
        }
      }
      checkStripeStatus()
    }
  }, [isLoaded, user, progress.displayName, progress.username, progress.avatarUrl, setProgress, setStep, stripeStatusMutation])

  // Validation helper for each step
  const validateStep = (step: number): boolean => {
    const formValues = form.state.values

    if (step === 1) {
      const result = onboardingStep1Schema.safeParse({ accountType: formValues.accountType })
      if (!result.success) {
        return false
      }
    }

    if (step === 2) {
      const result = onboardingStep2Schema.safeParse({
        displayName: formValues.displayName,
        username: formValues.username,
        bio: formValues.bio,
        avatarUrl: formValues.avatarUrl,
      })
      if (!result.success) {
        return false
      }
    }

    if (step === 3) {
      const result = onboardingStep3Schema.safeParse({
        location: formValues.location,
        country: formValues.country,
        genres: formValues.genres,
        shipsWorldwide: formValues.shipsWorldwide,
      })
      if (!result.success) {
        return false
      }
    }

    return true
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      form.setFieldValue("avatarUrl", url)
      setProgress({ avatarUrl: url })
    }
    reader.readAsDataURL(file)
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (!validateStep(currentStep)) {
      return
    }

    // Skip Stripe Connect step if user is only a collector
    if (currentStep === 4 && progress.accountType === "collector") {
      setStep(6)
    } else {
      setStep(Math.min(currentStep + 1, TOTAL_STEPS))
    }
  }

  const skipStripeConnect = () => {
    // Skip to review step
    setStep(6)
  }

  const prevStep = () => {
    setStep(Math.max(currentStep - 1, 1))
  }

  const handleCompleteOnboarding = async (data: OnboardingCompleteData) => {
    try {
      // Upload avatar if changed
      let finalAvatarUrl = data.avatarUrl
      if (avatarFile) {
        try {
          finalAvatarUrl = await uploadAvatarMutation.mutateAsync(avatarFile)
          form.setFieldValue("avatarUrl", finalAvatarUrl)
        } catch (error) {
          console.error("Failed to upload avatar:", error)
          // Continue with existing avatar URL if upload fails
        }
      }

      // Create user profile in database
      await completeOnboardingMutation.mutateAsync({
        accountType: data.accountType,
        displayName: data.displayName,
        username: data.username,
        bio: data.bio,
        avatarUrl: finalAvatarUrl,
        location: data.location,
        country: data.country,
        genres: data.genres,
        shipsWorldwide: data.shipsWorldwide,
        subscriptionTier: data.subscriptionTier || null,
        stripeAccountId: data.stripeAccountId || null,
      })

      // Clear onboarding progress from Zustand
      reset()

      // Reload Clerk user to get updated metadata
      try {
        await user?.reload()
      } catch (error) {
        console.warn("Failed to reload Clerk user:", error)
      }

      // Redirect to dashboard - use window.location for full page reload
      // This ensures middleware sees the updated session
      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Error completing onboarding:", error)
      alert(error instanceof Error ? error.message : "Something went wrong. Please try again.")
    }
  }

  if (!isLoaded || completeOnboardingMutation.isPending || uploadAvatarMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const progressPercent = (currentStep / TOTAL_STEPS) * 100
  const formValues = form.state.values

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src="/my-vinyl-shop-logo.svg"
            alt="my-vinyl.shop"
            width={120}
            height={48}
            className="h-8 w-auto"
          />
          <Button variant="ghost" size="sm" onClick={() => signOut({ redirectUrl: "/" })}>
            Sign out
          </Button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Step content */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {/* Step 1: Account Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome to my-vinyl.shop</h1>
                <p className="text-muted-foreground text-lg">
                  Let&apos;s set up your account. How do you plan to use the platform?
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  {
                    type: "collector" as const,
                    icon: User,
                    title: "Collector",
                    description: "Browse, buy, and showcase your vinyl collection",
                  },
                  {
                    type: "seller" as const,
                    icon: Store,
                    title: "Seller",
                    description: "List and sell records from your inventory",
                  },
                  {
                    type: "both" as const,
                    icon: ShoppingBag,
                    title: "Both",
                    description: "Buy, sell, and showcase your collection",
                  },
                ].map(({ type, icon: Icon, title, description }) => (
                  <Card
                    key={type}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      formValues.accountType === type
                        ? "ring-2 ring-primary border-primary"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() => {
                      form.setFieldValue("accountType", type)
                      setProgress({ accountType: type })
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          formValues.accountType === type
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                      {formValues.accountType === type && (
                        <div className="mt-3">
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Profile Info */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Create your profile</h1>
                <p className="text-muted-foreground text-lg">Tell the community about yourself</p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                {/* Avatar upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
                      {formValues.avatarUrl ? (
                        <Image
                          src={formValues.avatarUrl || "/placeholder.svg"}
                          alt="Avatar"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-10 w-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload a profile photo</p>
                </div>

                <div className="grid gap-4">
                  <form.Field
                    name="displayName"
                    validators={{
                      onChange: ({ value }) => {
                        const result = onboardingStep2Schema.shape.displayName.safeParse(value)
                        return result.success ? undefined : result.error.errors[0]?.message
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            setProgress({ displayName: e.target.value })
                          }}
                          placeholder="Your name"
                          className={`h-12 rounded-xl ${
                            field.state.meta.errors.length > 0 ? "border-red-500" : ""
                          }`}
                        />
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="username"
                    validators={{
                      onChange: ({ value }) => {
                        const result = onboardingStep2Schema.shape.username.safeParse(value)
                        return result.success ? undefined : result.error.errors[0]?.message
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            @
                          </span>
                          <Input
                            id="username"
                            value={field.state.value}
                            onChange={(e) => {
                              const sanitized = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "")
                              field.handleChange(sanitized)
                              setProgress({ username: sanitized })
                            }}
                            placeholder="username"
                            className={`h-12 rounded-xl pl-8 ${
                              field.state.meta.errors.length > 0 ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="bio">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={field.state.value || ""}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            setProgress({ bio: e.target.value })
                          }}
                          placeholder="Tell us about your vinyl journey..."
                          className="rounded-xl resize-none"
                          rows={3}
                        />
                      </div>
                    )}
                  </form.Field>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location & Genres */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Your preferences</h1>
                <p className="text-muted-foreground text-lg">Help us personalize your experience</p>
              </div>

              <div className="max-w-xl mx-auto space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <form.Field name="location">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="location">City</Label>
                        <Input
                          id="location"
                          value={field.state.value || ""}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            setProgress({ location: e.target.value })
                          }}
                          placeholder="Your city"
                          className="h-12 rounded-xl"
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="country"
                    validators={{
                      onChange: ({ value }) => {
                        const result = onboardingStep3Schema.shape.country.safeParse(value)
                        return result.success ? undefined : result.error.errors[0]?.message
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <select
                          id="country"
                          value={field.state.value || ""}
                          onChange={(e) => {
                            field.handleChange(e.target.value)
                            setProgress({ country: e.target.value })
                          }}
                          className={`w-full h-12 rounded-xl border border-input bg-background px-4 ${
                            field.state.meta.errors.length > 0 ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select country</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                  <form.Field
                    name="genres"
                    validators={{
                      onChange: ({ value }) => {
                        const result = onboardingStep3Schema.shape.genres.safeParse(value || [])
                        return result.success ? undefined : result.error.errors[0]?.message
                      },
                    }}
                  >
                    {(field) => (
                      <div className="space-y-3">
                        <Label>Favorite Genres</Label>
                        <p className="text-sm text-muted-foreground">
                          Select the genres you&apos;re interested in
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {genres.map((genre) => {
                            const currentGenres = field.state.value || []
                            return (
                              <button
                                key={genre}
                                type="button"
                                onClick={() => {
                                  const newGenres = currentGenres.includes(genre)
                                    ? currentGenres.filter((g) => g !== genre)
                                    : [...currentGenres, genre]
                                  field.handleChange(newGenres)
                                  setProgress({ genres: newGenres })
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                  currentGenres.includes(genre)
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted hover:bg-muted/80"
                                }`}
                              >
                                {genre}
                              </button>
                            )
                          })}
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {field.state.meta.errors[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>

                {(progress.accountType === "seller" || progress.accountType === "both") && (
                  <form.Field name="shipsWorldwide">
                    {(field) => (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                        <Checkbox
                          id="shipsWorldwide"
                          checked={field.state.value}
                          onCheckedChange={(checked) => {
                            field.handleChange(checked as boolean)
                            setProgress({ shipsWorldwide: checked as boolean })
                          }}
                        />
                        <div className="flex-1">
                          <Label htmlFor="shipsWorldwide" className="flex items-center gap-2 cursor-pointer">
                            <Globe className="h-4 w-4" />I ship worldwide
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Enable international shipping for your listings
                          </p>
                        </div>
                      </div>
                    )}
                  </form.Field>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Subscription Selection */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Choose your plan</h1>
                <p className="text-muted-foreground text-lg">
                  Select a subscription plan to unlock features for selling on the platform
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <PricingTable
                  appearance={{
                    elements: {
                      rootBox: "mx-auto",
                    },
                  }}
                />
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    You can always upgrade or downgrade later in your settings
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 5: Stripe Connect Onboarding (Sellers/Both only) */}
          {currentStep === 5 && (progress.accountType === "seller" || progress.accountType === "both") && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">Set up payments (Optional)</h1>
                <p className="text-muted-foreground text-lg">
                  Connect your Stripe account to receive payments from buyers. You can skip this for now
                  and complete it later in your settings, but you&apos;ll need it to create listings.
                </p>
              </div>

              <Card className="max-w-xl mx-auto">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Stripe Connect</h3>
                      <p className="text-sm text-muted-foreground">Secure payment processing for your sales</p>
                    </div>
                  </div>

                  {!formValues.stripeAccountId && !isCreatingStripeAccount && (
                    <Button
                      onClick={async () => {
                        setIsCreatingStripeAccount(true)
                        try {
                          // Create Stripe Connect account
                          const { accountId } = await createStripeAccountMutation.mutateAsync()
                          form.setFieldValue("stripeAccountId", accountId)
                          setProgress({ stripeAccountId: accountId })

                          // Create onboarding link
                          const { url } = await createStripeLinkMutation.mutateAsync(accountId)

                          // Redirect to Stripe onboarding
                          window.location.href = url
                        } catch (error) {
                          console.error("Error setting up Stripe:", error)
                          alert("Failed to set up payments. Please try again.")
                        } finally {
                          setIsCreatingStripeAccount(false)
                        }
                      }}
                      className="w-full"
                      disabled={isCreatingStripeAccount || createStripeAccountMutation.isPending}
                    >
                      {isCreatingStripeAccount || createStripeAccountMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Connect Stripe Account
                        </>
                      )}
                    </Button>
                  )}

                  {formValues.stripeAccountId && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Checking your account status...</p>
                      <Button
                        onClick={async () => {
                          try {
                            const statusData = await stripeStatusMutation.mutateAsync()
                            if (statusData.status === "active") {
                              // Account is ready, continue
                              nextStep()
                            } else if (statusData.status === "pending") {
                              // Need to complete onboarding
                              const { url } = await createStripeLinkMutation.mutateAsync(
                                formValues.stripeAccountId!
                              )
                              window.location.href = url
                            }
                          } catch (error) {
                            console.error("Error checking Stripe status:", error)
                          }
                        }}
                        variant="outline"
                        className="w-full"
                        disabled={stripeStatusMutation.isPending}
                      >
                        {stripeStatusMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          "Check Status"
                        )}
                      </Button>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    You&apos;ll be redirected to Stripe to complete the setup. This usually takes just a
                    few minutes.
                  </p>

                  <div className="pt-4 border-t">
                    <Button variant="outline" onClick={skipStripeConnect} className="w-full">
                      Skip for now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      You can complete this later in your settings. You&apos;ll need it to create
                      listings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 6: Review & Complete */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">You&apos;re all set!</h1>
                <p className="text-muted-foreground text-lg">
                  Review your profile before getting started
                </p>
              </div>

              <Card className="max-w-xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {formValues.avatarUrl ? (
                        <Image
                          src={formValues.avatarUrl || "/placeholder.svg"}
                          alt="Avatar"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{formValues.displayName || "Your Name"}</h3>
                      <p className="text-muted-foreground">@{formValues.username || "username"}</p>
                      {formValues.bio && <p className="text-sm mt-2">{formValues.bio}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="font-medium capitalize">{formValues.accountType}</span>
                    </div>
                    {(formValues.location || formValues.country) && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">
                          {[formValues.location, formValues.country].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {formValues.genres.length > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Genres</span>
                        <span className="font-medium text-right max-w-[200px]">
                          {formValues.genres.join(", ")}
                        </span>
                      </div>
                    )}
                    {(progress.accountType === "seller" || progress.accountType === "both") && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Ships Worldwide</span>
                        <span className="font-medium">{formValues.shipsWorldwide ? "Yes" : "No"}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={currentStep === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !formValues.accountType) ||
                (currentStep === 5 &&
                  (progress.accountType === "seller" || progress.accountType === "both") &&
                  !formValues.stripeAccountId &&
                  isCreatingStripeAccount)
              }
              className="gap-2"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <Button type="submit" disabled={completeOnboardingMutation.isPending} className="gap-2">
                {completeOnboardingMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating profile...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
