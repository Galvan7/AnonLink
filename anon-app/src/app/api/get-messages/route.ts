import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import mongoose from "mongoose";
import { User } from "next-auth";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = session.user as User;
        const userId = new mongoose.Types.ObjectId(user._id);

        // ✅ Aggregation Pipeline
        const result = await userModel.aggregate([
            { $match: { _id: userId } },
            { $project: { _id: 0, messages: 1 } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: null, messages: { $push: "$messages" } } },
            { $project: { messages: 1, _id: 0 } }
        ]);

        const messages = result[0]?.messages || [];

        return NextResponse.json({
            success: true,
            count: messages.length,
            messages,
        },
            { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/messages:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
