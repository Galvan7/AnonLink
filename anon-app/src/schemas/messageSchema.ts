import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Message content cannot be empty")
    .max(500, "Message must be at most 500 characters"),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
});

export type MessageSchema = z.infer<typeof messageSchema>;
