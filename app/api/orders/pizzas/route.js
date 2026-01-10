import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextResponse } from "next/server";

// GET - Get all order pizzas
export async function GET() {
    try {
        await connectDB();
        
        const orders = await Order.find({}).select('pizzas');
        
        // 提取所有订单中的披萨
        const allPizzas = orders.reduce((acc, order) => {
            return acc.concat(order.pizzas);
        }, []);

        return NextResponse.json({ success: true, data: allPizzas });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to get order pizzas", error: error.message },
            { status: 500 }
        );
    }
}