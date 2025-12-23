"use client";

import React from "react";
import { ListingFormWrapper } from "@/components/dashboard/listing-form-wrapper";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function NewListingPage() {
  const [stripeConnectStatus, setStripeConnectStatus] = useState<{
    hasAccount: boolean;
    status: string | null;
    accountId: string | null;
    isSeller: boolean;
  } | null>(null);

  useEffect(() => {
    const checkStripe = async () => {
      try {
        const res = await fetch("/api/stripe/connect/check");
        if (res.ok) {
          const data = await res.json();
          setStripeConnectStatus(data);
        }
      } catch (error) {
        console.error("Error checking Stripe:", error);
      }
    };
    checkStripe();
  }, []);

  const showStripeBanner =
    stripeConnectStatus?.isSeller &&
    (!stripeConnectStatus.hasAccount || stripeConnectStatus.status !== "active");

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Listing</h1>
          <p className="text-muted-foreground">Add a new vinyl record to the marketplace</p>
        </div>

        {showStripeBanner && (
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-sm">
                    {!stripeConnectStatus?.hasAccount
                      ? "Set up payments to create listings"
                      : "Complete your payment setup"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    You need an active Stripe Connect account to receive payments
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={async () => {
                  try {
                    if (!stripeConnectStatus?.hasAccount) {
                      const accountRes = await fetch("/api/stripe/connect/create-account", {
                        method: "POST",
                      });
                      if (!accountRes.ok) throw new Error("Failed to create account");
                      const { accountId } = await accountRes.json();

                      const linkRes = await fetch("/api/stripe/connect/create-link", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accountId }),
                      });
                      if (!linkRes.ok) throw new Error("Failed to create link");
                      const { url } = await linkRes.json();
                      window.location.href = url;
                    } else {
                      const linkRes = await fetch("/api/stripe/connect/create-link", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accountId: stripeConnectStatus.accountId }),
                      });
                      if (!linkRes.ok) throw new Error("Failed to create link");
                      const { url } = await linkRes.json();
                      window.location.href = url;
                    }
                  } catch (error) {
                    alert("Failed to set up payments. Please try again.");
                  }
                }}
                className="rounded-full"
              >
                Set up payments
              </Button>
            </CardContent>
          </Card>
        )}

        <ListingFormWrapper />
      </div>
      <DashboardBottomNav />
    </div>
  );
}
