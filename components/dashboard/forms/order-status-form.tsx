"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/orders";
import { Loader2 } from "lucide-react";
import { useActionState, useOptimistic } from "react";

interface OrderStatusFormProps {
  orderId: string;
  currentStatus: string;
  currentTracking?: string;
}

const orderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
});

export function OrderStatusForm({ orderId, currentStatus, currentTracking }: OrderStatusFormProps) {
  const [state, formAction] = useActionState(updateOrderStatus, { error: null });

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(currentStatus, (current, newStatus: string) => newStatus);

  const form = useForm({
    defaultValues: {
      status: optimisticStatus,
      trackingNumber: currentTracking || "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = orderStatusSchema.safeParse(value);
        if (!result.success) {
          const errors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            const path = err.path.join(".");
            if (path) {
              errors[path] = err.message;
            }
          });
          return errors;
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("status", value.status);
      if (value.trackingNumber) {
        formData.set("trackingNumber", value.trackingNumber);
      }

      setOptimisticStatus(value.status);
      await formAction(formData);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="status">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Status</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </form.Field>

      <form.Field name="trackingNumber">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Tracking Number (optional)</Label>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Enter tracking number"
            />
          </div>
        )}
      </form.Field>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" disabled={isSubmitting} className="rounded-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
