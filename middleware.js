import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  // Only run middleware for API routes that need authentication
  if (request.nextUrl.pathname.startsWith('/api/orders') || 
      request.nextUrl.pathname.startsWith('/api/payments')) {
    
    const token = request.cookies.get('auth-token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const payload = await verifyToken(token.value);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    // Add user ID to request headers for use in API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/orders/:path*',
    '/api/payments/:path*'
  ]
}