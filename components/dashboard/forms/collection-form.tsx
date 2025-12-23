"use client";

import { VinylForm } from "./vinyl-form";

interface CollectionFormProps {
  onSuccess?: () => void;
}

export function CollectionForm({ onSuccess }: CollectionFormProps) {
  return <VinylForm mode="collection" onSuccess={onSuccess} />;
}
