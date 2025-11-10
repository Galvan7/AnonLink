import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import { z } from "zod";
import { Message } from "@/model/User";


export async function POST(req: Request) {
  try {
    await dbConnect();
    const {username, content} = await req.json();
    // Find the user receiving the message
    const user = await userModel.findOne({ userName: username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMsg) {
      return NextResponse.json(
        { success: false, message: "User is not accepting messages currently." },
        { status: 403 }
      );
    }

    // Push the message
    user.messages.push({
      content,
      createdAt: new Date(),
    } as Message);

    await user.save();

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
