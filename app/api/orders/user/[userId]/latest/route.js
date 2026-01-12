import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { userId } = params;
        await connectDB();
        
        const latestOrder = await Order.findOne({ user_id: userId })
            .sort({ createdAt: -1 })
            .limit(1);
            
        if (!latestOrder) {
            return NextResponse.json(
                { success: false, message: "No orders found for the user with the specified ID." },
                { status: 404 }
            );
        }
        
        const transformedOrder = {
            ...latestOrder.toObject(),
            id: latestOrder._id.toString()
        };
        
        return NextResponse.json({
            success: true,
            latestOrder: transformedOrder
        });
    } catch (error) {
        console.error('Error fetching the latest order by user ID:', error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch the latest order by user ID", error: error.message },
            { status: 500 }
        );
    }
}