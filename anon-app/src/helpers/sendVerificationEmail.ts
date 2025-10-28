import { resend } from "@/lib/resend"
import { VerificationEmail } from "../../emails/VerificationEmails"
import { ApiResponse } from "@/types/ApiResponse"

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse> {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonlink Verification code',
            react: VerificationEmail({username:username,otp:verifycode}),
        });
        return { success: true, message: "Sent verification email" }

    } catch (error) {
        console.error("Error sending verification email", error)
        return { success: false, message: "Failed to send verification email" }

    }
}