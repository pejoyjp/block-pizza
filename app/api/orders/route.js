import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const data = await request.json();
        const { userId, items, totalPrice, additionalDetails } = data;

        await connectDB();

        const pizzas = items.map(item => ({
            pizza_id: item.pizza_id,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            customizations: item.customizations
        }));

        const newOrder = new Order({
            user_id: userId,
            total_price: totalPrice,
            status: 'Pending',
            delivery_address: additionalDetails.deliveryAddress,
            contact_phone: additionalDetails.contactPhone,
            pizzas: pizzas
        });

        const savedOrder = await newOrder.save();
        console.log('Order and order details saved:', savedOrder._id);
        
        return NextResponse.json({
            success: true,
            message: "Order saved successfully!",
            orderId: savedOrder._id.toString()
        });
    } catch (error) {
        console.error('Error saving order:', error);
        return NextResponse.json(
            { success: false, message: "Failed to save order", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectDB();
        
        const orders = await Order.find({});
        
        const transformedOrders = orders.map(order => ({
            ...order.toObject(),
            id: order._id.toString()
        }));
        
        return NextResponse.json({ success: true, orders: transformedOrders });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to get all orders", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const data = await request.json();
        const { orderId, newStatus, riderId } = data;

        await connectDB();
        
        const updateData = { status: newStatus };
        if (riderId) {
            updateData.rider_id = riderId;
        }
        
        const result = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );
        
        if (!result) {
            return NextResponse.json(
                { success: false, message: "No order found with the specified ID." },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Order status updated successfully!"
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { success: false, message: "Failed to update order status", error: error.message },
            { status: 500 }
        );
    }
}