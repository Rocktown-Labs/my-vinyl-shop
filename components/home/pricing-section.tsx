"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Disc3, Sparkles, Crown, Check, Gavel } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual sellers and collectors",
    features: [
      "Up to 10 active listings",
      "Fixed price selling",
      "Basic seller profile",
      "Standard support",
      "5% transaction fee",
    ],
    cta: "Get Started",
    href: "/auth/signup",
    popular: false,
  },
  {
    name: "Vinyl Pro",
    price: "$9",
    period: "/month",
    description: "For serious sellers who want to grow",
    features: [
      "Unlimited listings",
      "Auction listings",
      "AI-powered listing creation",
      "Featured seller badge",
      "Priority support",
      "3% transaction fee",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    href: "/auth/signup?plan=pro",
    popular: true,
  },
  {
    name: "Crate Digger",
    price: "$24",
    period: "/month",
    description: "For power sellers and shops",
    features: [
      "Everything in Vinyl Pro",
      "Bulk listing tools",
      "Custom storefront URL",
      "API access",
      "1.5% transaction fee",
      "Dedicated account manager",
      "Early access to features",
    ],
    cta: "Contact Sales",
    href: "/auth/signup?plan=digger",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-28" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto">
            Start selling for free, upgrade when you're ready to unlock auctions, AI tools, and lower fees.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className={`relative h-full border-0 shadow-lg ${tier.popular ? "ring-2 ring-primary shadow-xl" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="px-4 py-1 text-xs font-semibold">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
                    {tier.name === "Free" && <Disc3 className="h-6 w-6 text-accent" />}
                    {tier.name === "Vinyl Pro" && <Sparkles className="h-6 w-6 text-accent" />}
                    {tier.name === "Crate Digger" && <Crown className="h-6 w-6 text-accent" />}
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {tier.name === "Vinyl Pro" && (
                      <li className="flex items-start gap-3 text-sm">
                        <Gavel className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="font-medium">Auction listings included</span>
                      </li>
                    )}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-full ${tier.popular ? "" : "bg-muted text-foreground hover:bg-muted/80"}`}
                    variant={tier.popular ? "default" : "secondary"}
                  >
                    <Link href={tier.href}>{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-8 sm:mt-12">
          All plans include secure payments, buyer protection, and access to our global marketplace.
        </p>
      </div>
    </section>
  );
}
