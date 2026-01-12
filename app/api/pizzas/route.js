import connectDB from "@/lib/db";
import Pizza from "@/lib/models/Pizza";
import { NextResponse } from "next/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 8;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const popular = searchParams.get('popular');
        const page = parseInt(searchParams.get('page')) || DEFAULT_PAGE;
        const limit = parseInt(searchParams.get('limit')) || DEFAULT_LIMIT;
        
        await connectDB();
        
        let data;
        let total;
        
        if (popular === 'true') {
            data = await Pizza.find({ is_popular: true });
            total = data.length;
        } else {
            total = await Pizza.countDocuments({});
            const skip = (page - 1) * limit;
            data = await Pizza.find({}).skip(skip).limit(limit);
        }
        
        const transformedData = data.map(pizza => ({
            ...pizza.toObject(),
            id: pizza._id.toString()
        }));
        
        return NextResponse.json({
            success: true,
            data: transformedData,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
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