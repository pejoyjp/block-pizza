import connectDB from "@/lib/db";
import UserContact from "@/lib/models/UserContact";

import { NextResponse } from "next/server";

// POST - Upload contact by user ID
export async function POST(request, { params }) {
    try {
        const { userId } = params;
        
        // Check if userId is valid
        if (!userId || userId === 'null' || userId === 'undefined') {
            return NextResponse.json(
                { success: false, message: 'Valid user ID is required' },
                { status: 400 }
            );
        }
        
        const data = await request.json();
        const { address, phoneNumber } = data;

        await connectDB();
        
        // 创建新的联系信息文档
        const newContact = new UserContact({
            user_id: userId,
            address: address,
            phone_number: phoneNumber
        });
        
        // 执行MongoDB插入操作
        const result = await newContact.save();
        
        return NextResponse.json({
            success: true,
            message: "Contact uploaded successfully",
            contactId: result._id
        });
    } catch (error) {
        console.error('Failed to upload contact:', error);
        return NextResponse.json(
            { success: false, message: "Failed to upload contact", error: error.message },
            { status: 500 }
        );
    }
}

// GET - Get contacts by user ID
export async function GET(request, { params }) {
    try {
        const { userId } = params;
        
        // Check if userId is valid
        if (!userId || userId === 'null' || userId === 'undefined') {
            return NextResponse.json(
                { success: false, message: 'Valid user ID is required' },
                { status: 400 }
            );
        }
        
        await connectDB();
        
        const results = await UserContact.find({ user_id: userId }).select('_id address phone_number');
        
        // 转换数据格式以保持兼容性
        const formattedResults = results.map(contact => ({
            id: contact._id,
            address: contact.address,
            phone_number: contact.phone_number
        }));

        return NextResponse.json({
            success: true,
            data: formattedResults
        });
    } catch (error) {
        console.error('Failed to get contacts:', error);
        return NextResponse.json(
            { success: false, message: "Failed to get contacts", error: error.message },
            { status: 500 }
        );
    }
}