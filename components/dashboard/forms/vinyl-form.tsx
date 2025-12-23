"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlus, X, Loader2, DollarSign, Gavel, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { genres, conditions } from "@/lib/mock-data";
import { createVinyl } from "@/lib/actions/vinyls";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AIAnalysisButton } from "./ai-analysis-button";
import type { VinylAnalysis } from "@/lib/types";
import { collectionSchema, listingSchema, type CollectionFormData, type ListingFormData } from "@/lib/validations/vinyl";
import { useActionState } from "react";

interface VinylFormProps {
  mode?: "collection" | "listing";
  initialData?: {
    title?: string;
    artist?: string;
    genre?: string;
    year?: number;
    condition?: string;
    sleeveCondition?: string;
    description?: string;
    images?: string; // JSON string
    type?: "new" | "used";
  };
  onSuccess?: () => void;
}

type RecordType = "sealed" | "used" | null;

export function VinylForm({ mode = "collection", initialData, onSuccess }: VinylFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [state, formAction] = useActionState(createVinyl, { error: null });

  // Image state - managed separately from form
  const [images, setImages] = useState<Array<{ type: string; url: string }>>(() => {
    if (initialData?.images) {
      try {
        return JSON.parse(initialData.images);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Record type state (for listing mode)
  const [recordType, setRecordType] = useState<RecordType>(
    initialData?.type === "new" ? "sealed" : initialData?.type === "used" ? "used" : null,
  );

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<VinylAnalysis | null>(null);

  // Get the appropriate schema based on mode
  const schema = mode === "collection" ? collectionSchema : listingSchema;

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      artist: initialData?.artist || "",
      genre: initialData?.genre || "",
      year: initialData?.year?.toString() || "",
      condition: (initialData?.condition as any) || "",
      sleeveCondition: initialData?.sleeveCondition || "",
      description: initialData?.description || "",
      recordType: recordType || null,
      showPricing: false,
      pricingType: "fixed" as "fixed" | "auction",
      price: "",
      startingBid: "",
      reservePrice: "",
      buyNowPrice: "",
      auctionDuration: "7",
      enableReserve: false,
      enableBuyItNow: false,
      quantity: "1",
    },
    validators: {
      onChange: ({ value }) => {
        const result = schema.safeParse(value);
        if (!result.success) {
          // Convert Zod errors to TanStack Form format
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            const path = err.path.join(".");
            if (path) {
              errors[path] = err.message;
            }
          });
          return Object.keys(errors).length > 0 ? errors : undefined;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      // Validate images separately
      if (mode === "collection" && images.length < 2) {
        return;
      }
      if (mode === "listing") {
        if (recordType === "sealed" && images.length < 2) {
          return;
        }
        if (recordType === "used" && images.length < 4) {
          return;
        }
      }

      const formData = new FormData();
      formData.set("title", value.title);
      formData.set("artist", value.artist);
      formData.set("genre", value.genre);
      formData.set("year", value.year || "");
      formData.set("condition", value.condition);
      formData.set("sleeveCondition", value.sleeveCondition || value.condition);
      formData.set("vinylCondition", value.condition);
      formData.set("type", recordType === "sealed" ? "new" : "used");
      formData.set("description", value.description || "");
      formData.set("images", JSON.stringify(images));

      const isListed = mode === "listing" || (mode === "collection" && value.showPricing && value.price);
      formData.set("isListed", isListed ? "true" : "false");
      formData.set("isInCollection", "true");

      if (isListed) {
        formData.set("price", value.price || "");
        formData.set("listingType", value.pricingType);
        if (value.pricingType === "auction") {
          formData.set("startingBid", value.startingBid || "");
          formData.set("reservePrice", value.enableReserve ? value.reservePrice : "");
          formData.set("buyNowPrice", value.enableBuyItNow ? value.buyNowPrice : "");
          formData.set(
            "auctionEndDate",
            new Date(Date.now() + Number.parseInt(value.auctionDuration) * 24 * 60 * 60 * 1000).toISOString(),
          );
        }
      }

      const result = await formAction(formData);

      if (!result?.error) {
        queryClient.invalidateQueries({ queryKey: ["vinyls", "collection"] });
        queryClient.invalidateQueries({ queryKey: ["vinyls", "listings"] });

        if (mode === "listing" || (mode === "collection" && isListed)) {
          router.push("/dashboard/listings");
        } else {
          router.push("/dashboard/collection");
        }

        onSuccess?.();
      }
    },
  });

  const handleImageUpload = async (type: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const { url } = await res.json();

      const imageType =
        mode === "collection"
          ? type === "frontCover"
            ? "front_cover"
            : type === "backCover"
              ? "back_cover"
              : `additional_${images.length}`
          : type;

      setImages((prev) => [...prev, { type: imageType, url }]);
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceedToAnalysis = () => {
    if (mode === "collection") {
      return images.length >= 2;
    }
    if (recordType === "sealed") {
      return images.some((img) => img.type === "front_cover") && images.some((img) => img.type === "back_cover");
    }
    return (
      images.some((img) => img.type === "front_cover") &&
      images.some((img) => img.type === "back_cover") &&
      images.some((img) => img.type === "vinyl_front") &&
      images.some((img) => img.type === "vinyl_back")
    );
  };

  const handleAnalyzeWithAI = async () => {
    if (!canProceedToAnalysis()) return;

    setIsAnalyzing(true);

    try {
      const imageUrls = images.map((img) => img.url);
      const isSealed = recordType === "sealed" || mode === "collection";

      const response = await fetch("/api/analyze-vinyl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls,
          isSealed,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze images");

      const analysis: VinylAnalysis = await response.json();
      setAiAnalysis(analysis);

      // Pre-fill form fields
      form.setFieldValue("title", analysis.title);
      form.setFieldValue("artist", analysis.artist);
      form.setFieldValue("genre", analysis.genre);
      form.setFieldValue("year", analysis.year);
      form.setFieldValue("condition", analysis.condition.overall as any);
      form.setFieldValue("sleeveCondition", analysis.condition.sleeveCondition);
      form.setFieldValue("description", analysis.description);
      if (form.getFieldValue("showPricing") || mode === "listing") {
        form.setFieldValue("price", analysis.priceEstimate.suggested.toString());
      }
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImageTypeLabel = (index: number) => {
    if (mode === "collection") {
      if (index === 0) return "Front Cover *";
      if (index === 1) return "Back Cover *";
      return `Additional Photo ${index - 1}`;
    }
    const types = ["front_cover", "back_cover", "vinyl_front", "vinyl_back"];
    const labels = ["Front Cover *", "Back Cover *", "Vinyl Side A *", "Vinyl Side B *"];
    const type = images[index]?.type;
    const typeIndex = types.indexOf(type || "");
    return typeIndex >= 0 ? labels[typeIndex] : `Image ${index + 1}`;
  };

  const getRequiredImageCount = () => {
    if (mode === "collection") return { min: 2, max: 6 };
    if (recordType === "sealed") return { min: 2, max: 2 };
    return { min: 4, max: 4 };
  };

  const { min: minImages, max: maxImages } = getRequiredImageCount();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Record Type (only for listing mode) */}
      {mode === "listing" && !recordType && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>What are you selling?</CardTitle>
            <CardDescription>This helps us know which images to request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRecordType("sealed")}
                className={cn(
                  "relative p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                  recordType === "sealed" ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <Badge variant="secondary" className="text-xs mb-2">2 images required</Badge>
                <h3 className="font-semibold text-lg mb-1">New / Sealed</h3>
                <p className="text-sm text-muted-foreground">Factory sealed or brand new</p>
              </button>
              <button
                type="button"
                onClick={() => setRecordType("used")}
                className={cn(
                  "relative p-6 rounded-xl border-2 text-left transition-all hover:border-primary/50",
                  recordType === "used" ? "border-primary bg-primary/5" : "border-border",
                )}
              >
                <Badge variant="secondary" className="text-xs mb-2">4 images required</Badge>
                <h3 className="font-semibold text-lg mb-1">Used / Opened</h3>
                <p className="text-sm text-muted-foreground">Previously owned</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Images */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            {mode === "collection"
              ? `Upload ${minImages}-${maxImages} photos (front and back cover required)`
              : recordType === "sealed"
                ? "Upload front and back cover photos"
                : "Upload cover photos and vinyl disc images"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="space-y-2">
                <Label className="text-xs text-muted-foreground">{getImageTypeLabel(index)}</Label>
                <div className="relative aspect-square rounded-xl border-2 border-border overflow-hidden bg-muted/30">
                  <img src={img.url} alt={getImageTypeLabel(index)} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {images.length < maxImages && (
              <>
                {mode === "collection" ? (
                  images.length < 2 ? (
                    <>
                      {!images.some((img) => img.type === "front_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Front Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("frontCover", file)}
                            label="Front Cover"
                          />
                        </div>
                      )}
                      {!images.some((img) => img.type === "back_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Back Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("backCover", file)}
                            label="Back Cover"
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Additional Photo</Label>
                      <ImageUploadSlot
                        onUpload={(file) => handleImageUpload(`additional_${images.length}`, file)}
                        label="Add Photo"
                      />
                    </div>
                  )
                ) : (
                  recordType === "sealed" ? (
                    <>
                      {!images.some((img) => img.type === "front_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Front Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("front_cover", file)}
                            label="Front Cover"
                          />
                        </div>
                      )}
                      {!images.some((img) => img.type === "back_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Back Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("back_cover", file)}
                            label="Back Cover"
                          />
                        </div>
                      )}
                    </>
                  ) : recordType === "used" ? (
                    <>
                      {!images.some((img) => img.type === "front_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Front Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("front_cover", file)}
                            label="Front Cover"
                          />
                        </div>
                      )}
                      {!images.some((img) => img.type === "back_cover") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Back Cover *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("back_cover", file)}
                            label="Back Cover"
                          />
                        </div>
                      )}
                      {!images.some((img) => img.type === "vinyl_front") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vinyl Side A *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("vinyl_front", file)}
                            label="Vinyl Side A"
                          />
                        </div>
                      )}
                      {!images.some((img) => img.type === "vinyl_back") && (
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Vinyl Side B *</Label>
                          <ImageUploadSlot
                            onUpload={(file) => handleImageUpload("vinyl_back", file)}
                            label="Vinyl Side B"
                          />
                        </div>
                      )}
                    </>
                  ) : null
                )}
              </>
            )}
          </div>

          {canProceedToAnalysis() && (
            <div className="flex justify-end pt-2">
              <AIAnalysisButton
                onClick={handleAnalyzeWithAI}
                disabled={!canProceedToAnalysis()}
                isAnalyzing={isAnalyzing}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Album Details */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Album Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="title">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Title *</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : Object.values(field.state.meta.errors[0] as any)[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="artist">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Artist *</Label>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    required
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : Object.values(field.state.meta.errors[0] as any)[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="genre">
              {(field) => (
                <div className="space-y-2">
                  <Label>Genre *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger>
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
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : Object.values(field.state.meta.errors[0] as any)[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="year">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Year</Label>
                  <Input
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : Object.values(field.state.meta.errors[0] as any)[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="condition">
              {(field) => (
                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as any)}
                  >
                    <SelectTrigger>
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
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : Object.values(field.state.meta.errors[0] as any)[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field name="sleeveCondition">
              {(field) => (
                <div className="space-y-2">
                  <Label>Sleeve Condition</Label>
                  <Select
                    value={field.state.value || ""}
                    onValueChange={(value) => field.handleChange(value || null)}
                  >
                    <SelectTrigger>
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
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Description</Label>
                <Textarea
                  id={field.name}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  rows={4}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      {/* Pricing Toggle (only for collection mode) */}
      {mode === "collection" && (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <form.Field name="showPricing">
              {(field) => (
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={field.name} className="text-base font-medium">
                      List for Sale
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle to add pricing and create a listing instead of just adding to collection
                    </p>
                  </div>
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={field.handleChange}
                  />
                </div>
              )}
            </form.Field>
          </CardContent>
        </Card>
      )}

      {/* Pricing Section */}
      <form.Subscribe selector={(state) => [state.values.showPricing, state.values.pricingType]}>
        {([showPricing, pricingType]) =>
          (mode === "listing" || (mode === "collection" && showPricing)) && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form.Field name="pricingType">
                  {(field) => (
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant={field.state.value === "fixed" ? "default" : "outline"}
                        onClick={() => field.handleChange("fixed")}
                        className="flex-1 rounded-full"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Fixed Price
                      </Button>
                      <Button
                        type="button"
                        variant={field.state.value === "auction" ? "default" : "outline"}
                        onClick={() => field.handleChange("auction")}
                        className="flex-1 rounded-full"
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Auction
                      </Button>
                    </div>
                  )}
                </form.Field>

                {pricingType === "fixed" ? (
                  <form.Field name="price">
                    {(field) => (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Price *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input
                            id={field.name}
                            type="number"
                            step="0.01"
                            min="0"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="pl-7"
                            placeholder="0.00"
                            required
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                        )}
                        {aiAnalysis && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.handleChange(aiAnalysis.priceEstimate.suggested.toString())}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Use AI suggestion: ${aiAnalysis.priceEstimate.suggested}
                          </Button>
                        )}
                      </div>
                    )}
                  </form.Field>
                ) : (
                  <div className="space-y-4">
                    <form.Field name="startingBid">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Starting Bid *</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input
                              id={field.name}
                              type="number"
                              step="0.01"
                              min="0"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              onBlur={field.handleBlur}
                              className="pl-7"
                              placeholder="0.00"
                              required
                            />
                          </div>
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-destructive">{field.state.meta.errors[0]}</p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="enableReserve">
                      {(field) => (
                        <div className="flex items-center gap-2">
                          <Switch
                            id={field.name}
                            checked={field.state.value}
                            onCheckedChange={field.handleChange}
                          />
                          <Label htmlFor={field.name}>Set Reserve Price</Label>
                        </div>
                      )}
                    </form.Field>

                    <form.Subscribe selector={(state) => state.values.enableReserve}>
                      {(enableReserve) =>
                        enableReserve && (
                          <form.Field name="reservePrice">
                            {(field) => (
                              <div className="space-y-2">
                                <Label htmlFor={field.name}>Reserve Price</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="pl-7"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            )}
                          </form.Field>
                        )
                      }
                    </form.Subscribe>

                    <form.Field name="enableBuyItNow">
                      {(field) => (
                        <div className="flex items-center gap-2">
                          <Switch
                            id={field.name}
                            checked={field.state.value}
                            onCheckedChange={field.handleChange}
                          />
                          <Label htmlFor={field.name}>Enable Buy It Now</Label>
                        </div>
                      )}
                    </form.Field>

                    <form.Subscribe selector={(state) => state.values.enableBuyItNow}>
                      {(enableBuyItNow) =>
                        enableBuyItNow && (
                          <form.Field name="buyNowPrice">
                            {(field) => (
                              <div className="space-y-2">
                                <Label htmlFor={field.name}>Buy It Now Price</Label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    $
                                  </span>
                                  <Input
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    className="pl-7"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                            )}
                          </form.Field>
                        )
                      }
                    </form.Subscribe>

                    <form.Field name="auctionDuration">
                      {(field) => (
                        <div className="space-y-2">
                          <Label htmlFor={field.name}>Auction Duration (days)</Label>
                          <Select
                            value={field.state.value}
                            onValueChange={field.handleChange}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 days</SelectItem>
                              <SelectItem value="5">5 days</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="10">10 days</SelectItem>
                              <SelectItem value="14">14 days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </form.Field>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        }
      </form.Subscribe>

      {state?.error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{state.error}</div>
      )}

      <form.Subscribe selector={(state) => [state.values.showPricing, state.isSubmitting]}>
        {([showPricing, isSubmitting]) => (
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === "listing" || (mode === "collection" && showPricing)
                    ? "Creating..."
                    : "Adding..."}
                </>
              ) : mode === "listing" || (mode === "collection" && showPricing) ? (
                "Create Listing"
              ) : (
                "Add to Collection"
              )}
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

function ImageUploadSlot({ onUpload, label }: { onUpload: (file: File) => void; label: string }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="relative aspect-square rounded-xl border-2 border-dashed border-border overflow-hidden group cursor-pointer hover:border-primary transition-colors bg-muted/30">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
        <ImagePlus className="h-8 w-8 mb-2" />
        <span className="text-xs">{label}</span>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}
