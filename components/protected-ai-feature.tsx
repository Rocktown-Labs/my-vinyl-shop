"use client";

import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface ProtectedAIFeatureProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredProducts?: string[];
}

export function ProtectedAIFeature({ 
  children, 
  fallback,
  requiredProducts = ["prod_vinyl_pro", "prod_crate_digger"]
}: ProtectedAIFeatureProps) {
  const { userId } = useAuth();
  
  // Check user's subscription tier
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

  // Check if user has required subscription tier
  const hasAccess = user?.subscriptionTier === "vinyl_pro" || user?.subscriptionTier === "crate_digger";

  if (!hasAccess) {
    return fallback || (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Lock className="h-5 w-5 text-amber-600" />
            Premium Feature
          </CardTitle>
          <CardDescription>
            AI-powered vinyl analysis is available for Vinyl Pro and Crate Digger subscribers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="rounded-full">
            <Link href="/dashboard/settings?tab=billing">
              Upgrade to Pro
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
