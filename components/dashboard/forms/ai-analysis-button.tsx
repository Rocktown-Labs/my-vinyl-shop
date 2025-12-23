"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Lock } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AIAnalysisButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isAnalyzing?: boolean;
}

export function AIAnalysisButton({ onClick, disabled, isAnalyzing }: AIAnalysisButtonProps) {
  const { userId } = useAuth();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      return data.user;
    },
    enabled: !!userId,
  });

  const hasAccess = user?.subscriptionTier === "vinyl_pro" || user?.subscriptionTier === "crate_digger";

  if (!hasAccess) {
    return (
      <div className="relative group">
        <Button
          type="button"
          variant="outline"
          disabled
          className="rounded-full opacity-50 cursor-not-allowed"
        >
          <Lock className="h-4 w-4 mr-2" />
          Analyze with AI
        </Button>
        <div className="absolute top-full right-0 mt-2 z-50 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <Card className="border-amber-200 bg-amber-50/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-amber-600" />
                Premium Feature
              </CardTitle>
              <CardDescription className="text-xs">
                AI-powered vinyl analysis is available for Vinyl Pro and Crate Digger subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button asChild size="sm" className="rounded-full w-full">
                <Link href="/dashboard/settings?tab=billing">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled || isAnalyzing}
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
  );
}
