import connectDB from "@/lib/db";
import User from "@/lib/models/User";
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const data = await request.json();
        const { name, email, password, avatar, role } = data;
        const saltRounds = 10;

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcryptjs.hash(password, saltRounds);
 
        const newUser = new User({
            username: name,
            email: email,
            hashed_password: hashedPassword,
            avatar_url: avatar,
            role: role
        });

        const result = await newUser.save();
        console.log('User registered successfully:', result);
  
        return NextResponse.json(
            { success: true, message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration failed:', error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, message: 'User with this email or username already exists' },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, message: 'Failed to register user' },
            { status: 500 }
        );
    }
}