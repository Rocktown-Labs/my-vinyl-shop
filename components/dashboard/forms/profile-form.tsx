"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useCurrentUser, useUpdateUser } from "@/lib/hooks/use-user";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedValue } from "@/lib/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { sanitizeUsername, isValidUsernameFormat } from "@/lib/utils/username";
import { useState, useEffect } from "react";

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(100),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and dashes"),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

export function ProfileForm() {
  const { user: clerkUser } = useUser();
  const { data: dbUser, isLoading } = useCurrentUser();
  const updateUser = useUpdateUser();
  const [usernameValue, setUsernameValue] = useState("");
  const debouncedUsername = useDebouncedValue(usernameValue, 500);

  // Check username availability
  const { data: usernameCheck, isLoading: isCheckingUsername } = useQuery({
    queryKey: ["username-availability", debouncedUsername],
    queryFn: async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) {
        return null;
      }
      if (!isValidUsernameFormat(debouncedUsername)) {
        return { available: false, reason: "Invalid format" };
      }
      if (debouncedUsername === dbUser?.username) {
        return { available: true }; // Same username, no need to check
      }
      const res = await fetch(`/api/users/check-username?username=${encodeURIComponent(debouncedUsername)}`);
      if (!res.ok) throw new Error("Failed to check username");
      return res.json();
    },
    enabled: !!debouncedUsername && debouncedUsername.length >= 3 && debouncedUsername !== dbUser?.username,
  });

  useEffect(() => {
    if (dbUser?.username) {
      setUsernameValue(dbUser.username);
    }
  }, [dbUser?.username]);

  const form = useForm({
    defaultValues: {
      displayName: dbUser?.displayName || clerkUser?.fullName || "",
      username: dbUser?.username || clerkUser?.username || "",
      bio: dbUser?.bio || "",
      location: dbUser?.location || "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = profileSchema.safeParse(value);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            const path = err.path.join(".");
            if (path) {
              errors[path] = err.message;
            }
          });
          return errors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      try {
        await updateUser.mutateAsync({
          displayName: value.displayName,
          username: value.username,
          bio: value.bio || null,
          location: value.location || null,
        });
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const avatarUrl = dbUser?.avatarUrl || clerkUser?.imageUrl || "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4 sm:space-y-6"
    >
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Profile Picture</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Update your profile image</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} />
            <AvatarFallback className="text-xl">
              {form.getFieldValue("displayName")?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" className="rounded-full bg-transparent w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Photo
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-4">
          <form.Field name="displayName">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm">
                  Display Name *
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Your display name"
                  required
                  className="h-11 rounded-xl"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {typeof field.state.meta.errors[0] === "string"
                      ? field.state.meta.errors[0]
                      : String(Object.values(field.state.meta.errors[0] as any)[0] || "")}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="username">
            {(field) => {
              const currentUsername = field.state.value;
              const isChecking = isCheckingUsername && currentUsername === debouncedUsername && currentUsername !== dbUser?.username;
              const checkResult = currentUsername === debouncedUsername ? usernameCheck : null;
              const isAvailable = checkResult?.available === true;
              const isUnavailable = checkResult?.available === false;
              const showAvailability = currentUsername.length >= 3 && currentUsername === debouncedUsername;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name} className="text-sm">
                    Username *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => {
                        const sanitized = sanitizeUsername(e.target.value);
                        field.handleChange(sanitized);
                        setUsernameValue(sanitized);
                      }}
                      onBlur={field.handleBlur}
                      placeholder="yourusername"
                      required
                      className="h-11 rounded-xl pl-8"
                    />
                    {isChecking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {showAvailability && !isChecking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isAvailable ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : isUnavailable ? (
                          <XCircle className="h-4 w-4 text-destructive" />
                        ) : null}
                      </div>
                    )}
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {typeof field.state.meta.errors[0] === "string"
                        ? field.state.meta.errors[0]
                        : String(Object.values(field.state.meta.errors[0] as any)[0] || "")}
                    </p>
                  )}
                  {showAvailability && !isChecking && checkResult && (
                    <p
                      className={`text-sm flex items-center gap-1 ${
                        isAvailable ? "text-green-600" : "text-destructive"
                      }`}
                    >
                      {isAvailable ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Username is available
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          {checkResult.reason || "Username is not available"}
                        </>
                      )}
                    </p>
                  )}
                  {dbUser?.lastUsernameChangeAt && (
                    <p className="text-xs text-muted-foreground">
                      You can change your username once every 30 days
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm">
                  Bio
                </Label>
                <Textarea
                  id={field.name}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Tell customers about yourself..."
                  rows={4}
                  className="rounded-xl resize-none"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="location">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name} className="text-sm">
                  Location
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value || ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="City, State"
                  className="h-11 rounded-xl"
                />
              </div>
            )}
          </form.Field>
        </CardContent>
      </Card>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button type="submit" disabled={isSubmitting} size="lg" className="rounded-full h-12 w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button type="button" variant="outline" size="lg" className="rounded-full bg-transparent h-12 w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        )}
      </form.Subscribe>
    </form>
  );
}

