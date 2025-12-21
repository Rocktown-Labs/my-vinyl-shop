"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Sparkles,
  Loader2,
  ImagePlus,
  Gavel,
  DollarSign,
  Info,
  Check,
  ChevronRight,
  ChevronLeft,
  Package,
  Disc3,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  X,
} from "lucide-react"
import { genres, conditions } from "@/lib/mock-data"
import { motion, AnimatePresence } from "motion/react"
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { VinylAnalysis } from "@/lib/types"

type PricingType = "fixed" | "auction"
type RecordType = "sealed" | "used" | null
type WizardStep = "type" | "images" | "review"

interface AISuggestion {
  field: string
  value: string | number
  accepted: boolean
}

export default function NewListingPage() {
  // Wizard state
  const [wizardStep, setWizardStep] = useState<WizardStep>("type")
  const [recordType, setRecordType] = useState<RecordType>(null)

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<VinylAnalysis | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [genre, setGenre] = useState("")
  const [year, setYear] = useState("")
  const [condition, setCondition] = useState("")
  const [sleeveCondition, setSleeveCondition] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")

  // Pricing type state
  const [pricingType, setPricingType] = useState<PricingType>("fixed")

  // Auction state
  const [startingBid, setStartingBid] = useState("")
  const [reservePrice, setReservePrice] = useState("")
  const [buyItNowPrice, setBuyItNowPrice] = useState("")
  const [auctionDuration, setAuctionDuration] = useState("7")
  const [enableBuyItNow, setEnableBuyItNow] = useState(false)
  const [enableReserve, setEnableReserve] = useState(false)

  // Image state
  const [frontCover, setFrontCover] = useState<string | null>(null)
  const [backCover, setBackCover] = useState<string | null>(null)
  const [vinylFront, setVinylFront] = useState<string | null>(null)
  const [vinylBack, setVinylBack] = useState<string | null>(null)

  // Track which AI suggestions have been accepted
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Set<string>>(new Set())

  const handleImageUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      switch (type) {
        case "front":
          setFrontCover(url)
          break
        case "back":
          setBackCover(url)
          break
        case "vinylFront":
          setVinylFront(url)
          break
        case "vinylBack":
          setVinylBack(url)
          break
      }
    }
  }

  const canProceedToAnalysis = useCallback(() => {
    if (recordType === "sealed") {
      return frontCover && backCover
    }
    return frontCover && backCover && vinylFront && vinylBack
  }, [recordType, frontCover, backCover, vinylFront, vinylBack])

  const handleAnalyzeWithAI = async () => {
    if (!canProceedToAnalysis()) return

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      const imageUrls = [frontCover, backCover]
      if (recordType === "used") {
        imageUrls.push(vinylFront, vinylBack)
      }

      const response = await fetch("/api/analyze-vinyl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: imageUrls.filter(Boolean),
          isSealed: recordType === "sealed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze images")
      }

      const analysis: VinylAnalysis = await response.json()
      setAiAnalysis(analysis)

      // Pre-fill form with AI suggestions
      setTitle(analysis.title)
      setArtist(analysis.artist)
      setGenre(analysis.genre)
      setYear(analysis.year)
      setCondition(analysis.condition.overall)
      setSleeveCondition(analysis.condition.sleeveCondition)
      setDescription(analysis.description)
      setPrice(analysis.priceEstimate.suggested.toString())

      // Mark all as accepted initially
      setAcceptedSuggestions(
        new Set(["title", "artist", "genre", "year", "condition", "sleeveCondition", "description", "price"]),
      )

      // Move to review step
      setWizardStep("review")
    } catch (error) {
      console.error("Analysis error:", error)
      setAnalysisError("Failed to analyze images. Please try again or continue with manual entry.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAcceptSuggestion = (field: string) => {
    setAcceptedSuggestions((prev) => new Set([...prev, field]))
  }

  const handleRejectSuggestion = (field: string) => {
    setAcceptedSuggestions((prev) => {
      const newSet = new Set(prev)
      newSet.delete(field)
      return newSet
    })
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[
        { step: "type", label: "Type", num: 1 },
        { step: "images", label: "Images", num: 2 },
        { step: "review", label: "Review", num: 3 },
      ].map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
              wizardStep === item.step
                ? "bg-primary text-primary-foreground"
                : item.num < (wizardStep === "type" ? 1 : wizardStep === "images" ? 2 : 3)
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {item.num < (wizardStep === "type" ? 1 : wizardStep === "images" ? 2 : 3) ? (
              <Check className="h-4 w-4" />
            ) : (
              item.num
            )}
          </div>
          <span
            className={cn(
              "ml-2 text-sm hidden sm:inline",
              wizardStep === item.step ? "text-foreground font-medium" : "text-muted-foreground",
            )}
          >
            {item.label}
          </span>
          {index < 2 && <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />}
        </div>
      ))}
    </div>
  )

  const renderTypeStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-xl sm:text-2xl">What are you selling?</CardTitle>
          <CardDescription>This helps us know which images to request</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setRecordType("sealed")}
              className={cn(
                "relative p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                recordType === "sealed" ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              {recordType === "sealed" && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              )}
              <Package className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-1">New / Sealed</h3>
              <p className="text-sm text-muted-foreground">
                Factory sealed or brand new. We'll need front and back cover images.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  2 images required
                </Badge>
              </div>
            </button>

            <button
              onClick={() => setRecordType("used")}
              className={cn(
                "relative p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                recordType === "used" ? "border-primary bg-primary/5" : "border-border",
              )}
            >
              {recordType === "used" && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
              )}
              <Disc3 className="h-10 w-10 mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-1">Used / Opened</h3>
              <p className="text-sm text-muted-foreground">
                Previously owned. We'll need cover images plus vinyl front and back.
              </p>
              <div className="mt-4 flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  4 images required
                </Badge>
              </div>
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setWizardStep("images")} disabled={!recordType} className="rounded-full">
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderImagesStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Upload Images</CardTitle>
          <CardDescription>
            {recordType === "sealed"
              ? "Upload front and back cover photos of your sealed vinyl"
              : "Upload photos of the cover (front & back) and the vinyl disc (both sides)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Cover Images */}
          <div>
            <h4 className="text-sm font-medium mb-3">Album Cover</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "front", label: "Front Cover", value: frontCover, required: true },
                { key: "back", label: "Back Cover", value: backCover, required: true },
              ].map((item) => (
                <div key={item.key} className="space-y-2">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    {item.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="relative aspect-square rounded-xl border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors bg-muted/30">
                    {item.value ? (
                      <>
                        <img
                          src={item.value || "/placeholder.svg"}
                          alt={item.label}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            if (item.key === "front") setFrontCover(null)
                            if (item.key === "back") setBackCover(null)
                          }}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <ImagePlus className="h-8 w-8 mb-2" />
                        <span className="text-xs">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(item.key, e)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vinyl Images - only for used */}
          {recordType === "used" && (
            <div>
              <h4 className="text-sm font-medium mb-3">Vinyl Disc</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "vinylFront", label: "Vinyl Side A", value: vinylFront, required: true },
                  { key: "vinylBack", label: "Vinyl Side B", value: vinylBack, required: true },
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      {item.label}
                      {item.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors bg-muted/30">
                      {item.value ? (
                        <>
                          <img
                            src={item.value || "/placeholder.svg"}
                            alt={item.label}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => {
                              if (item.key === "vinylFront") setVinylFront(null)
                              if (item.key === "vinylBack") setVinylBack(null)
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                          <Disc3 className="h-8 w-8 mb-2" />
                          <span className="text-xs">Click to upload</span>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(item.key, e)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysisError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {analysisError}
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setWizardStep("type")} className="rounded-full">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setWizardStep("review")} className="rounded-full">
                Skip AI, Enter Manually
              </Button>
              <Button
                onClick={handleAnalyzeWithAI}
                disabled={!canProceedToAnalysis() || isAnalyzing}
                className="rounded-full"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const renderAISuggestionBadge = (field: string, suggestedValue: string | number) => {
    if (!aiAnalysis) return null

    const isAccepted = acceptedSuggestions.has(field)

    return (
      <div className="flex items-center gap-1 mt-1">
        <Badge
          variant={isAccepted ? "default" : "secondary"}
          className={cn(
            "text-xs cursor-pointer transition-colors",
            isAccepted ? "bg-green-500 hover:bg-green-600" : "hover:bg-primary/20",
          )}
          onClick={() => (isAccepted ? handleRejectSuggestion(field) : handleAcceptSuggestion(field))}
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI: {suggestedValue}
          {isAccepted && <Check className="h-3 w-3 ml-1" />}
        </Badge>
      </div>
    )
  }

  const renderReviewStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images Preview */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[frontCover, backCover, vinylFront, vinylBack].filter(Boolean).map((img, i) => (
                  <div key={i} className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                    <img src={img! || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                <button
                  onClick={() => setWizardStep("images")}
                  className="shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Album Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Album Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">
                    Album Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Kind of Blue"
                    className="h-10 rounded-lg"
                  />
                  {aiAnalysis && renderAISuggestionBadge("title", aiAnalysis.title)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-sm">
                    Artist
                  </Label>
                  <Input
                    id="artist"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="Miles Davis"
                    className="h-10 rounded-lg"
                  />
                  {aiAnalysis && renderAISuggestionBadge("artist", aiAnalysis.artist)}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres
                        .filter((g) => g !== "All Genres")
                        .map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {aiAnalysis && renderAISuggestionBadge("genre", aiAnalysis.genre)}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm">
                    Year
                  </Label>
                  <Input
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="1959"
                    className="h-10 rounded-lg"
                  />
                  {aiAnalysis && renderAISuggestionBadge("year", aiAnalysis.year)}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm">Vinyl Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c} className="capitalize">
                          {c.replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {aiAnalysis && renderAISuggestionBadge("condition", aiAnalysis.condition.overall.replace("-", " "))}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Sleeve Condition</Label>
                  <Select value={sleeveCondition} onValueChange={setSleeveCondition}>
                    <SelectTrigger className="h-10 rounded-lg">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c} value={c} className="capitalize">
                          {c.replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {aiAnalysis &&
                    renderAISuggestionBadge("sleeveCondition", aiAnalysis.condition.sleeveCondition.replace("-", " "))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the condition, pressing details, and any notable features..."
                  rows={4}
                  className="rounded-lg resize-none"
                />
                {aiAnalysis && (
                  <div className="flex items-center gap-1 mt-1">
                    <Badge
                      variant={acceptedSuggestions.has("description") ? "default" : "secondary"}
                      className={cn(
                        "text-xs cursor-pointer transition-colors",
                        acceptedSuggestions.has("description")
                          ? "bg-green-500 hover:bg-green-600"
                          : "hover:bg-primary/20",
                      )}
                      onClick={() => {
                        if (acceptedSuggestions.has("description")) {
                          handleRejectSuggestion("description")
                        } else {
                          setDescription(aiAnalysis.description)
                          handleAcceptSuggestion("description")
                        }
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI description available
                      {acceptedSuggestions.has("description") && <Check className="h-3 w-3 ml-1" />}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={pricingType === "fixed" ? "default" : "outline"}
                  onClick={() => setPricingType("fixed")}
                  className="rounded-full flex-1"
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  Fixed Price
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant={pricingType === "auction" ? "default" : "outline"}
                        onClick={() => setPricingType("auction")}
                        className="rounded-full flex-1 relative"
                      >
                        <Gavel className="h-4 w-4 mr-1" />
                        Auction
                        <Badge className="absolute -top-2 -right-2 text-[10px] px-1.5 py-0 h-4 bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                          PRO
                        </Badge>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Auctions require Vinyl Pro subscription</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {pricingType === "fixed" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm">
                      Price ($)
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="29.99"
                      className="h-10 rounded-lg"
                    />
                    {aiAnalysis && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-primary/20"
                          onClick={() => setPrice(aiAnalysis.priceEstimate.suggested.toString())}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Suggested: ${aiAnalysis.priceEstimate.suggested}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-sm">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-10 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 p-4 rounded-lg bg-muted/50">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startingBid" className="text-sm">
                        Starting Bid ($)
                      </Label>
                      <Input
                        id="startingBid"
                        type="number"
                        step="0.01"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        placeholder="1.00"
                        className="h-10 rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Duration</Label>
                      <Select value={auctionDuration} onValueChange={setAuctionDuration}>
                        <SelectTrigger className="h-10 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="10">10 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="enableReserve" className="text-sm">
                        Reserve Price
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Minimum price to sell</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch id="enableReserve" checked={enableReserve} onCheckedChange={setEnableReserve} />
                  </div>
                  {enableReserve && (
                    <Input
                      type="number"
                      step="0.01"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                      placeholder="Reserve price"
                      className="h-10 rounded-lg"
                    />
                  )}

                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="enableBuyItNow" className="text-sm">
                      Buy It Now
                    </Label>
                    <Switch id="enableBuyItNow" checked={enableBuyItNow} onCheckedChange={setEnableBuyItNow} />
                  </div>
                  {enableBuyItNow && (
                    <Input
                      type="number"
                      step="0.01"
                      value={buyItNowPrice}
                      onChange={(e) => setBuyItNowPrice(e.target.value)}
                      placeholder="Buy it now price"
                      className="h-10 rounded-lg"
                    />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setWizardStep("images")} className="rounded-full">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button size="lg" className="rounded-full">
              Create Listing
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* AI Suggestions Panel - 1 column */}
        {aiAnalysis && (
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm sticky top-20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Analysis
                </CardTitle>
                <CardDescription className="text-xs">{aiAnalysis.confidence}% confidence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 rounded-lg bg-background/80">
                  <p className="font-medium">{aiAnalysis.title}</p>
                  <p className="text-muted-foreground">
                    {aiAnalysis.artist} • {aiAnalysis.year}
                  </p>
                  {aiAnalysis.label && <p className="text-xs text-muted-foreground mt-1">{aiAnalysis.label}</p>}
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Condition Notes</p>
                  <p className="text-xs bg-background/80 p-2 rounded-lg">{aiAnalysis.condition.notes}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Price Recommendation</p>
                  <div className="bg-background/80 p-3 rounded-lg">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">${aiAnalysis.priceEstimate.suggested}</span>
                      <span className="text-xs text-muted-foreground">
                        (${aiAnalysis.priceEstimate.low} - ${aiAnalysis.priceEstimate.high})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{aiAnalysis.priceEstimate.reasoning}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-full bg-transparent"
                  onClick={() => {
                    setTitle(aiAnalysis.title)
                    setArtist(aiAnalysis.artist)
                    setGenre(aiAnalysis.genre)
                    setYear(aiAnalysis.year)
                    setCondition(aiAnalysis.condition.overall)
                    setSleeveCondition(aiAnalysis.condition.sleeveCondition)
                    setDescription(aiAnalysis.description)
                    setPrice(aiAnalysis.priceEstimate.suggested.toString())
                    setAcceptedSuggestions(
                      new Set([
                        "title",
                        "artist",
                        "genre",
                        "year",
                        "condition",
                        "sleeveCondition",
                        "description",
                        "price",
                      ]),
                    )
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept All Suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-24 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Create Listing</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Add a new vinyl record to your shop</p>
      </div>

      {renderStepIndicator()}

      <AnimatePresence mode="wait">
        {wizardStep === "type" && renderTypeStep()}
        {wizardStep === "images" && renderImagesStep()}
        {wizardStep === "review" && renderReviewStep()}
      </AnimatePresence>

      <DashboardBottomNav />
    </div>
  )
}
