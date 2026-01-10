import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function GET() {
    try {
        const userId = await getAuthUser();
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        await connectDB();
        const user = await User.findById(userId).select('_id email name');
        
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Auth check failed:', error);
        return NextResponse.json(
            { success: false, message: 'Authentication check failed' },
            { status: 500 }
        );
    }
}