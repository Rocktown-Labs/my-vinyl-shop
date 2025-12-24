"use client";

import { Badge } from "@/components/ui/badge";
import { Disc3, ShieldCheck, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  {
    icon: Disc3,
    title: "AI-Powered Listings",
    desc: "Upload photos and let AI identify your records automatically",
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    desc: "Protected payments with buyer and seller guarantees",
  },
  {
    icon: TrendingUp,
    title: "Seller Profiles",
    desc: "Build your brand with Instagram-style showcase pages",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <Badge variant="secondary" className="mb-4">
              Why my-vinyl.shop
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 sm:mb-6">
              The marketplace built for vinyl lovers
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              Whether you're hunting for a rare first pressing or building your collection, we've created the
              perfect platform for discovering and selling vinyl records.
            </p>
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 sm:gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/vinyl-record-player-close-up-aesthetic.jpg"
                alt="Vinyl record player"
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-6 shadow-xl border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent ml-1" />
                </div>
                <div>
                  <p className="font-semibold">2.5M+</p>
                  <p className="text-sm text-muted-foreground">Records sold</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
