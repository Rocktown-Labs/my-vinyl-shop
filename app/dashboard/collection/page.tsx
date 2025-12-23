"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, List } from "lucide-react";
import Link from "next/link";
import { DashboardBottomNav } from "@/components/dashboard-bottom-nav";
import { CollectionGrid } from "@/components/dashboard/collection-grid";

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">My Collection</h1>
            <p className="text-muted-foreground">
              Your personal vinyl collection (not for sale)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button asChild>
              <Link href="/dashboard/collection/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Link>
            </Button>
          </div>
        </div>

        <CollectionGrid viewMode={viewMode} />
      </div>
      <DashboardBottomNav />
    </div>
  );
}
