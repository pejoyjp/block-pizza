import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });
        
        clearAuthCookie(response);
        return response;
    } catch (error) {
        console.error('Logout failed:', error);
        return NextResponse.json(
            { success: false, message: 'Logout failed' },
            { status: 500 }
        );
    }
}