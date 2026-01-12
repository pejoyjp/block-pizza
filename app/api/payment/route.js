import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Stripe from 'stripe';
import { NextResponse } from "next/server";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

// POST - Save payment
export async function POST(request) {
    try {
        const data = await request.json();
        const {
            userId,
            instruction,
            paymentStatus,
            totalPrice,
            status,
            paymentMethod,
            deliveryAddress,
            contactPhone,
            deliveryMethod
        } = data;

        await connectDB();

        const newOrder = new Order({
            user_id: userId,
            total_price: totalPrice,
            status: status,
            delivery_address: deliveryAddress,
            contact_phone: contactPhone,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            special_instructions: instruction,
            delivery_method: deliveryMethod
        });

        const result = await newOrder.save();
        const orderId = result._id.toString();
        console.log(orderId);

        return NextResponse.json({
            success: true,
            message: "Pay successfully",
            orderId: orderId,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to save payment", error: error.message },
            { status: 500 }
        );
    }
}