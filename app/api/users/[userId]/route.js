import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET - Get user by user ID
export async function GET(request, { params }) {
    try {
        const { userId } = params;
        
        // 验证userId是否为有效的ObjectId
        if (!userId || userId === 'null' || userId === 'undefined' || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID" },
                { status: 400 }
            );
        }
        
        await connectDB();
        
        const user = await User.findById(userId);
        
        if (user) {
            return NextResponse.json({ success: true, user: user });
        } else {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch user due to server error", error: error.message },
            { status: 500 }
        );
    }
}