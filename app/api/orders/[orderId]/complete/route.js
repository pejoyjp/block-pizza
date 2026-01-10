import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

// PUT - Complete order
export async function PUT(request, { params }) {
    try {
        const { orderId } = params;
        
        await connectDB();
        
        const result = await Order.findByIdAndUpdate(
            orderId,
            { status: 'completed' },
            { new: true }
        );
        
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true, message: "Order completed successfully" });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to complete order", error: error.message },
            { status: 500 }
        );
    }
}