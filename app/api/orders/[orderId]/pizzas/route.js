import connectDB from "@/lib/db";
import Order from "@/lib/models/Order";
import Pizza from "@/lib/models/Pizza";
import { NextResponse } from "next/server";

// GET - Get order pizzas by order ID
export async function GET(request, { params }) {
    try {
        const { orderId } = params;
        
        await connectDB();
        
        const order = await Order.findById(orderId).select('pizzas');
        
        if (!order) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }

        const pizzasWithDetails = await Promise.all(
            order.pizzas.map(async (orderPizza) => {
                const pizza = await Pizza.findById(orderPizza.pizza_id);
                return {
                    ...orderPizza.toObject(),
                    pizzaDetails: pizza ? {
                        id: pizza._id,
                        name: pizza.name,
                        description: pizza.description,
                        img: pizza.img,
                        veg: pizza.veg,
                        is_popular: pizza.is_popular
                    } : null
                };
            })
        );

        return NextResponse.json({ success: true, orderPizzas: pizzasWithDetails });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to get order pizzas", error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Save order pizzas
export async function PUT(request, { params }) {
    try {
        const { orderId } = params;
        const data = await request.json();
        const { pizzas } = data;
        
        if (!pizzas || !Array.isArray(pizzas) || pizzas.length === 0) {
            return NextResponse.json(
                { success: false, message: "No pizzas data provided" },
                { status: 400 }
            );
        }
        
        await connectDB();
        
        // 准备披萨数据
        const pizzasData = pizzas.map(cartItem => ({
            pizza_id: cartItem.id,
            quantity: cartItem.quantity,
            size: cartItem.sizeandcrust,
            price: cartItem.price,
            toppings: cartItem.toppings
        }));
        
        // 更新订单，添加披萨信息
        const result = await Order.findByIdAndUpdate(
            orderId,
            { $push: { pizzas: { $each: pizzasData } } },
            { new: true }
        );
        
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Order not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ success: true, message: "Order pizzas saved successfully!" });
    } catch (error) {
        console.error('Error saving order pizzas:', error);
        return NextResponse.json(
            { success: false, message: "Failed to save order pizzas", error: error.message },
            { status: 500 }
        );
    }
}