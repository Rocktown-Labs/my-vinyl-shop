"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6 text-balance">
              Ready to start your vinyl journey?
            </h2>
            <p className="text-sm sm:text-lg text-background/70 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of collectors buying and selling records on the world's most thoughtful vinyl marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full"
              >
                <Link href="/auth/signup">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-medium rounded-full border-background/30 text-background hover:bg-background/10 hover:text-background bg-transparent"
              >
                <Link href="/browse">Explore Records</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
