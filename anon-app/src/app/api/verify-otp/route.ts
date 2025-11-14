import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import jwt from "jsonwebtoken";
import { z } from "zod";

const VerifySchema = z.object({
  token: z.string(),
  code: z.string().length(6, "Verification code must be 6 digits")
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }
    const { token, code } = parsed.data;
    const decoded = jwt.verify(
      token,
      process.env.NEXT_AUTH_SECRET!
    ) as { username: string };
    await dbConnect();
    const allUsers = await userModel.find({ userName: decoded.username });
    if (!allUsers || allUsers.length === 0) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const verifiedUser = allUsers.find(u => u.isVerified === true);
    if (verifiedUser) {
      await userModel.deleteMany({
        userName: decoded.username,
        isVerified: false
      });
      return NextResponse.json({
        success: true,
        message: "Already verified"
      });
    }
    const targetUser = allUsers.find(u => u.verifyCode === code);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    }
    if (new Date(targetUser.verifyCodeExpiry) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Code expired" },
        { status: 400 }
      );
    }
    targetUser.isVerified = true;
    targetUser.verifyCode = "";
    targetUser.verifyCodeExpiry = new Date(0);
    await targetUser.save();
    await userModel.deleteMany({
      userName: decoded.username,
      _id: { $ne: targetUser._id }
    });
    return NextResponse.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("Verify Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
