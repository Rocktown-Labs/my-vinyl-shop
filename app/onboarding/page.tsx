"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { User, Store, ShoppingBag, ArrowRight, ArrowLeft, Check, Upload, Globe, Loader2 } from "lucide-react"

const TOTAL_STEPS = 4

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
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form data
  const [accountType, setAccountType] = useState<"collector" | "seller" | "both" | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [location, setLocation] = useState("")
  const [country, setCountry] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [shipsWorldwide, setShipsWorldwide] = useState(false)

  // Load existing progress
  useEffect(() => {
    if (!isLoaded || !user) return

    const loadProgress = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/onboarding/progress")
        if (res.ok) {
          const data = await res.json()
          if (data.progress) {
            setCurrentStep(data.progress.currentStep || 1)
            const saved = data.progress.data || {}
            if (saved.accountType) setAccountType(saved.accountType)
            if (saved.displayName) setDisplayName(saved.displayName)
            if (saved.username) setUsername(saved.username)
            if (saved.bio) setBio(saved.bio)
            if (saved.avatarUrl) setAvatarUrl(saved.avatarUrl)
            if (saved.location) setLocation(saved.location)
            if (saved.country) setCountry(saved.country)
            if (saved.genres) setSelectedGenres(saved.genres)
            if (saved.shipsWorldwide) setShipsWorldwide(saved.shipsWorldwide)
          }
        }
      } catch {
        // Ignore errors, start fresh
      }
      setIsLoading(false)
    }

    // Pre-fill from Clerk user
    if (user.fullName) setDisplayName(user.fullName)
    if (user.username) setUsername(user.username)
    if (user.imageUrl) setAvatarUrl(user.imageUrl)

    loadProgress()
  }, [isLoaded, user])

  // Save progress to Redis
  const saveProgress = async (step: number) => {
    setIsSaving(true)
    try {
      await fetch("/api/onboarding/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: step,
          data: {
            accountType,
            displayName,
            username,
            bio,
            avatarUrl,
            location,
            country,
            genres: selectedGenres,
            shipsWorldwide,
          },
        }),
      })
    } catch {
      // Ignore save errors
    }
    setIsSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFile(file)
    // Preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const nextStep = async () => {
    await saveProgress(currentStep + 1)
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const completeOnboarding = async () => {
    setIsLoading(true)
    try {
      // Upload avatar if changed
      let finalAvatarUrl = avatarUrl
      if (avatarFile) {
        const formData = new FormData()
        formData.append("file", avatarFile)
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
        if (uploadRes.ok) {
          const { url } = await uploadRes.json()
          finalAvatarUrl = url
        }
      }

      // Create user profile in database
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          displayName,
          username,
          bio,
          avatarUrl: finalAvatarUrl,
          location,
          country,
          genres: selectedGenres,
          shipsWorldwide,
        }),
      })

      if (res.ok) {
        router.push("/dashboard")
      } else {
        const error = await res.json()
        alert(error.message || "Failed to complete onboarding")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    }
    setIsLoading(false)
  }

  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image src="/my-vinyl-shop-logo.svg" alt="my-vinyl.shop" width={120} height={48} className="h-8 w-auto" />
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
          {isSaving && <span className="text-xs text-muted-foreground">Saving...</span>}
        </div>
        <Progress value={progress} className="h-2" />
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
                      accountType === type ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
                    }`}
                    onClick={() => setAccountType(type)}
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                          accountType === type ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground">{description}</p>
                      {accountType === type && (
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
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl || "/placeholder.svg"}
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
                      <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload a profile photo</p>
                </div>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your name"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="username"
                        className="h-12 rounded-xl pl-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us about your vinyl journey..."
                      className="rounded-xl resize-none"
                      rows={3}
                    />
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="location">City</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your city"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full h-12 rounded-xl border border-input bg-background px-4"
                    >
                      <option value="">Select country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Favorite Genres</Label>
                  <p className="text-sm text-muted-foreground">Select the genres you&apos;re interested in</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          setSelectedGenres((prev) =>
                            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
                          )
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedGenres.includes(genre)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {(accountType === "seller" || accountType === "both") && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                    <Checkbox
                      id="shipsWorldwide"
                      checked={shipsWorldwide}
                      onCheckedChange={(checked) => setShipsWorldwide(checked as boolean)}
                    />
                    <div className="flex-1">
                      <Label htmlFor="shipsWorldwide" className="flex items-center gap-2 cursor-pointer">
                        <Globe className="h-4 w-4" />I ship worldwide
                      </Label>
                      <p className="text-sm text-muted-foreground">Enable international shipping for your listings</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Complete */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-3">You&apos;re all set!</h1>
                <p className="text-muted-foreground text-lg">Review your profile before getting started</p>
              </div>

              <Card className="max-w-xl mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl || "/placeholder.svg"}
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
                      <h3 className="font-semibold text-lg">{displayName || "Your Name"}</h3>
                      <p className="text-muted-foreground">@{username || "username"}</p>
                      {bio && <p className="text-sm mt-2">{bio}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Account Type</span>
                      <span className="font-medium capitalize">{accountType}</span>
                    </div>
                    {(location || country) && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{[location, country].filter(Boolean).join(", ")}</span>
                      </div>
                    )}
                    {selectedGenres.length > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">Genres</span>
                        <span className="font-medium text-right max-w-[200px]">{selectedGenres.join(", ")}</span>
                      </div>
                    )}
                    {(accountType === "seller" || accountType === "both") && (
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Ships Worldwide</span>
                        <span className="font-medium">{shipsWorldwide ? "Yes" : "No"}</span>
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
            <Button onClick={nextStep} disabled={currentStep === 1 && !accountType} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={completeOnboarding} disabled={isLoading} className="gap-2">
              {isLoading ? (
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
          )}
        </div>
      </div>
    </div>
  )
}
