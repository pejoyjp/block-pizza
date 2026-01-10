import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

// GET - Get orders by user ID
export async function GET(request, { params }) {
    try {
        const { userId } = params;
        await connectDB();
        
        const orders = await Order.find({ user_id: userId });
        return NextResponse.json({
            success: true,
            orders: orders
        });
    } catch (error) {
        console.error('Error fetching orders by user ID:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}