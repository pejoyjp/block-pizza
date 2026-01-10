import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET - Get orders by rider ID
export async function GET(request, { params }) {
    try {
        const { riderId } = params;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        
        await connectDB();
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(riderId)) {
            return NextResponse.json(
                { success: false, message: `Invalid rider ID format` },
                { status: 400 }
            );
        }
        
        let query = { rider_id: riderId };
        
        if (status === 'completed') {
            query.status = 'completed';
        } else {
            query.status = 'deliverying';
        }
        
        const orders = await Order.find(query);
        
        const responseKey = status === 'completed' ? 'completedOrders' : 'orders';
        
        return NextResponse.json({ 
            success: true, 
            [responseKey]: orders 
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `Failed to get orders by riderId`, error: error.message },
            { status: 500 }
        );
    }
}