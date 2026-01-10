import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

// GET - Get order by order ID and user ID
export async function GET(request, { params }) {
    try {
        const { orderId } = params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        await connectDB();
        
        let query = { _id: orderId };
        if (userId) {
            query.user_id = userId;
        }
        
        const order = await Order.findOne(query);
        
        if (!order) {
            return NextResponse.json(
                { success: false, message: "No order found with the specified ID." },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Order details retrieved successfully!",
            order: order
        });
    } catch (error) {
        console.error('Error retrieving order details:', error);
        return NextResponse.json(
            { success: false, message: "Failed to retrieve order details", error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update order (for riders)
export async function PUT(request, { params }) {
    try {
        const { orderId } = params;
        const data = await request.json();
        const { riderId, status } = data;

        await connectDB();
        
        // Check if rider already exists for this order
        const existingOrder = await Order.findOne({ 
            _id: orderId, 
            rider_id: { $ne: null } 
        });
        
        if (existingOrder) {
            return NextResponse.json(
                { success: false, message: "order already has been taken" },
                { status: 400 }
            );
        }

        const result = await Order.findByIdAndUpdate(
            orderId,
            { 
                rider_id: riderId, 
                status: status 
            },
            { new: true }
        );
        
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Order updated successfully!" });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to update order status", error: error.message },
            { status: 500 }
        );
    }
}