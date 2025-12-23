"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CollectionForm } from "@/components/dashboard/forms/collection-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddCollectionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/collection">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Add to Collection</h1>
            <p className="text-muted-foreground">
              Add a record to your personal collection (not for sale)
            </p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Record Details</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Fill in the details of the vinyl record you want to add to your collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <CollectionForm
              onSuccess={() => {
                router.push("/dashboard/collection");
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
