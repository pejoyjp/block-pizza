import connectDB from "@/lib/db";
import Topping from "@/lib/models/Topping";
import PizzaTopping from "@/lib/models/PizzaTopping";
import { NextResponse } from "next/server";

// GET - Get toppings by pizza ID
export async function GET(request, { params }) {
    try {
        const { pizzaId } = params;
        
        await connectDB();
        
        // 获取所有toppings
        const allToppings = await Topping.find({});
        
        // 获取该pizza的topping关联信息
        const pizzaToppings = await PizzaTopping.find({ pizza_id: pizzaId });
        
        // 创建pizza topping的映射
        const pizzaToppingMap = {};
        pizzaToppings.forEach(pt => {
            pizzaToppingMap[pt.topping_id.toString()] = pt.quantity;
        });
        
        // 合并数据
        const toppings = allToppings.map(topping => ({
            name: topping.name,
            quantity: pizzaToppingMap[topping._id.toString()] || 0,
            price: topping.price,
            isVeg: topping.is_veg,
            total_price: (pizzaToppingMap[topping._id.toString()] || 0) * topping.price
        }));
        
        return NextResponse.json({
            success: true,
            data: toppings,
            message: "Toppings retrieved successfully."
        });
    } catch (error) {
        console.error('Error in getToppingsByPizzaId:', error);
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to retrieve toppings." },
            { status: 500 }
        );
    }
}