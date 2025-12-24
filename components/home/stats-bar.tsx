"use client";

import { motion } from "framer-motion";
import { useHomeData } from "@/lib/hooks/use-home";
import { Skeleton } from "@/components/ui/skeleton";

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K+`;
  }
  return `${num}+`;
}

export function StatsBar() {
  const { data, isLoading } = useHomeData();

  const stats = data
    ? [
        { value: formatNumber(data.stats.totalListings), label: "Records Listed" },
        { value: formatNumber(data.stats.totalSellers), label: "Active Sellers" },
        { value: data.stats.satisfactionRate, label: "Satisfaction Rate" },
        { value: data.stats.countries, label: "Countries" },
      ]
    : [
        { value: "50K+", label: "Records Listed" },
        { value: "12K+", label: "Active Sellers" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "45+", label: "Countries" },
      ];

  return (
    <section className="border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {isLoading ? (
                <>
                  <Skeleton className="h-8 sm:h-10 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </>
              ) : (
                <>
                  <p className="text-xl sm:text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
