import connectDB from "@/lib/db";
import Pizza from "@/lib/models/Pizza";

import { NextResponse } from "next/server";

// GET - Get pizza by ID
export async function GET(request, { params }) {
    try {
        const { pizzaId } = params;
        await connectDB();
        
        const result = await Pizza.findById(pizzaId);
        
        if (result) {
            // Transform data to include id field for frontend compatibility
            const transformedData = {
                ...result.toObject(),
                id: result._id.toString()
            };
            
            return NextResponse.json({
                success: true,
                data: transformedData,
                message: "Pizza retrieved successfully."
            });
        } else {
            return NextResponse.json(
                { success: false, message: "No pizza found with the given ID." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error in getPizzaById:', error);
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to retrieve pizza." },
            { status: 500 }
        );
    }
}

// PUT - Update pizza by ID
export async function PUT(request, { params }) {
    try {
        const { pizzaId } = params;
        const updatedPizzaData = await request.json();
        const { name, veg, price, description, img, popular, inch9, inch12 } = updatedPizzaData;
        
        await connectDB();

        const sizeJson = {"M": {"price": price}, "L": {"price": inch9}, "XL": {"price": inch12}};

        const result = await Pizza.findByIdAndUpdate(
            pizzaId,
            {
                name: name,
                veg: veg,
                price: price,
                description: description,
                img: img,
                is_popular: popular,
                sizeandcrust: sizeJson
            },
            { new: true }
        );
        
        if (result) {
            return NextResponse.json({
                success: true,
                message: `Pizza with ID ${pizzaId} updated successfully.`
            });
        } else {
            return NextResponse.json(
                { success: false, message: `Pizza with ID ${pizzaId} not found.` },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error in updatePizzaByPizzaId:', error);
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to update pizza." },
            { status: 500 }
        );
    }
}

// DELETE - Delete pizza by ID
export async function DELETE(request, { params }) {
    try {
        const { pizzaId } = params;
        
        await connectDB();

        const result = await Pizza.findByIdAndDelete(pizzaId);
        
        if (result) {
            return NextResponse.json({
                success: true,
                message: `Pizza with ID ${pizzaId} deleted successfully.`
            });
        } else {
            return NextResponse.json(
                { success: false, message: `Pizza with ID ${pizzaId} not found.` },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error in deletePizzaByPizzaId:', error);
        return NextResponse.json(
            { success: false, error: error.message, message: "Failed to delete pizza." },
            { status: 500 }
        );
    }
}