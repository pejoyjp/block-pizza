import connectDB from "@/lib/db";
import Feedback from "@/lib/models/Feedback";
import { NextResponse } from "next/server";

// POST - Upload feedback
export async function POST(request) {
    try {
        const data = await request.json();
        const { email, feedback, name } = data;

        await connectDB();
        
        // Create new feedback document
        const newFeedback = new Feedback({
            email: email,
            feedback_text: feedback,
            name: name
        });
        
        // Save the feedback to MongoDB
        await newFeedback.save();

        return NextResponse.json({
            success: true,
            message: "uploaded successfully!",
        });
    } catch (error) {
        console.error("Error uploading feedback:", error);
        return NextResponse.json(
            { success: false, message: "Failed to upload feedback" },
            { status: 500 }
        );
    }
}

// GET - Get all feedback
export async function GET() {
    try {
        await connectDB();
        
        // Fetch all feedback from MongoDB
        const result = await Feedback.find({});

        return NextResponse.json({
            success: true,
            message: "fetched successfully!",
            res: result
        });
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch feedback" },
            { status: 500 }
        );
    }
}