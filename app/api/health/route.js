import connectDB from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: 'success', 
      message: '数据库连接正常',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('数据库连接失败:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: '数据库连接失败',
      error: error.message 
    }, { status: 500 });
  }
}