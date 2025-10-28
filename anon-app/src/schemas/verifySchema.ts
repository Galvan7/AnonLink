import { z } from "zod";

export const verifyCodeSchema = z.object({
  verifyCode: z
    .string()
    .min(6, { message: "Verification code must be 6 characters long" })
    .max(6, { message: "Verification code must be 6 characters long" })
    .regex(/^[0-9]+$/, { message: "Verification code must contain only digits" }),
});

export type VerifyCodeSchema = z.infer<typeof verifyCodeSchema>;
