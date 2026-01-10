import connectDB from "@/lib/db";
import Pizza from "@/lib/models/Pizza";
import { NextResponse } from "next/server";

// GET - Get all pizzas or popular pizzas
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const popular = searchParams.get('popular');
        
        await connectDB();
        
        let data;
        if (popular === 'true') {
            data = await Pizza.find({ is_popular: true });
        } else {
            data = await Pizza.find({});
        }
        
        // Transform data to include id field for frontend compatibility
        const transformedData = data.map(pizza => ({
            ...pizza.toObject(),
            id: pizza._id.toString()
        }));
        
        return NextResponse.json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to get pizzas", error: error.message },
            { status: 500 }
        );
    }
}

// POST - Add a new pizza
export async function POST(request) {
    try {
        const pizzaData = await request.json();
        const { name, veg, price, description, img, popular, inch9, inch12 } = pizzaData;
        
        await connectDB();

        const sizeJson = {"M": {"price": price}, "L": {"price": inch9}, "XL": {"price": inch12}};

        const newPizza = new Pizza({
            name: name,
            veg: veg,
            price: price,
            description: description,
            quantity: 1,
            img: img,
            is_popular: popular,
            sizeandcrust: sizeJson
        });

        const result = await newPizza.save();
        
        return NextResponse.json({
            success: true,
            data: result._id,
            message: "Pizza added successfully."
        });
    } catch (error) {
        console.error('Error in addANewPizza:', error);
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to add pizza." },
            { status: 500 }
        );
    }
}