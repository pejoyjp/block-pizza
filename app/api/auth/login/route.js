import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
    try {
        const data = await request.json();
        const { email, password } = data;

        await connectDB();
        
        const user = await User.findOne({ email: email }).select('_id email hashed_password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        const isMatch = await bcryptjs.compare(password, user.hashed_password);

        if (isMatch) {
            const token = await createToken(user.id);
            const response = NextResponse.json(
                {
                    success: true,
                    message: "Login successful.",
                    userId: user.id,
                },
                { status: 200 }
            );
            
            setAuthCookie(response, token);
            return response;
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid credentials." },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login failed:', error);
        return NextResponse.json(
            { success: false, message: 'Login failed due to server error' },
            { status: 500 }
        );
    }
}