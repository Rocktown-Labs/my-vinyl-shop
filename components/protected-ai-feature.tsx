"use client";

import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";

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
  const { has } = useAuth();

  // Check if user has the AI feature or a plan that includes it
  // Using Clerk B2C billing: check feature 'ai_powered_listing_creation' or plans 'vinyl_pro'/'crate_digger'
  const hasAccess =
    (has && has({ feature: "ai_powered_listing_creation" })) ||
    (has && has({ plan: "vinyl_pro" })) ||
    (has && has({ plan: "crate_digger" })) ||
    false;

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
