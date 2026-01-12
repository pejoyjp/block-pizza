import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        
        const pendingOrders = await Order.find({
            status: 'Pending',
            rider_id: null
        }).sort({ createdAt: -1 });
        
        const transformedOrders = pendingOrders.map(order => ({
            ...order.toObject(),
            id: order._id.toString()
        }));
        
        return NextResponse.json({
            success: true,
            orders: transformedOrders
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch pending orders", error: error.message },
            { status: 500 }
        );
    }
}