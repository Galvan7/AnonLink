import { z } from "zod";

export const acceptMessageSchema = z.object({
  acceptMessages: z.boolean(),
});

export type AcceptMessageSchema = z.infer<typeof acceptMessageSchema>;
