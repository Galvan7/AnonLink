import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";


const VerifyOTPSchema = z.object({
  username: z.string(),
  code: z
    .string()
    .min(4, "Code must be at least 4 digits")
    .max(8, "Code must be less than 8 digits"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifyOTPSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Internal security breach",
        },
        { status: 400 }
      );
    }

    const { username, code } = parsed.data;
    await dbConnect();
    const user = await userModel.findOne({ userName:username });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: true, message: "User already verified" },
        { status: 200 }
      );
    }

    if (user.verifyCode !== code) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (new Date(user.verifyCodeExpiry) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.verifyCode = "";
    user.verifyCodeExpiry = new Date(0);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
