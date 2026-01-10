import connectDB from "@/lib/db";
import UserContact from "@/lib/models/UserContact";
import { NextResponse } from "next/server";

// DELETE - Delete contact by user ID and contact ID
export async function DELETE(request, { params }) {
    try {
        const { userId, contactId } = params;
        
        await connectDB();
        
        const result = await UserContact.findOneAndDelete({
            _id: contactId,
            user_id: userId
        });
        
        if (!result) {
            return NextResponse.json(
                { success: false, message: "Contact not found" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            success: true,
            message: "Contact deleted successfully"
        });
    } catch (error) {
        console.error('Failed to delete contact:', error);
        return NextResponse.json(
            { success: false, message: "Failed to delete contact", error: error.message },
            { status: 500 }
        );
    }
}