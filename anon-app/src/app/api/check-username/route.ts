import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
  username:usernameValidation
});


export async function GET(req: Request) {
  
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    const validation = UsernameQuerySchema.safeParse({ username });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.format().username?._errors || [] },
        { status: 400 }
      );
    }
    const existingVerUser = await userModel.findOne({ userName: username, isVerified:true });
    if (existingVerUser) {
      return NextResponse.json({
        success: false,
        available: false,
        message: "Username already taken",
      });
    }

    return NextResponse.json({
      success: true,
      available: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
