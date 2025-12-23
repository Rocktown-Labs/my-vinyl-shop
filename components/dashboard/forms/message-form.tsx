"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendMessage } from "@/lib/actions/messages";
import { Send, Loader2 } from "lucide-react";
import { useActionState, useOptimistic } from "react";

interface MessageFormProps {
  conversationId: string;
}

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
});

export function MessageForm({ conversationId }: MessageFormProps) {
  const [state, formAction] = useActionState(sendMessage, { error: null });

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    [] as Array<{ id: string; content: string; senderId: string; createdAt: Date }>,
    (current, newMessage: { id: string; content: string; senderId: string; createdAt: Date }) => [
      ...current,
      newMessage,
    ]
  );

  const form = useForm({
    defaultValues: {
      content: "",
    },
    validators: {
      onChange: ({ value }) => {
        const result = messageSchema.safeParse(value);
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
      formData.set("conversationId", conversationId);
      formData.set("content", value.content);

      // Optimistic update
      addOptimisticMessage({
        id: `temp-${Date.now()}`,
        content: value.content,
        senderId: "current-user",
        createdAt: new Date(),
      });

      await formAction(formData);

      // Clear input
      form.setFieldValue("content", "");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex gap-2"
    >
      <form.Field name="content">
        {(field) => (
          <>
            <Input
              id={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Type a message..."
              className="rounded-full flex-1"
              required
            />
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" size="icon" disabled={isSubmitting} className="rounded-full shrink-0">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              )}
            </form.Subscribe>
            {field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive absolute bottom-0">
                {typeof field.state.meta.errors[0] === "string"
                  ? field.state.meta.errors[0]
                  : Object.values(field.state.meta.errors[0] as any)[0]}
              </p>
            )}
          </>
        )}
      </form.Field>
      {state?.error && <p className="text-sm text-destructive absolute bottom-0">{state.error}</p>}
    </form>
  );
}
