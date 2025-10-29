import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test basic functionality
    const basicTest = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Basic API endpoint working'
    };

    // Test environment variables
    const envTest = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_SET: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      CLERK_SECRET_KEY_SET: !!process.env.CLERK_SECRET_KEY,
      MONGODB_URL_SET: !!process.env.MONGODB_URL,
      OPENAI_API_KEY_SET: !!process.env.OPENAI_API_KEY,
    };

    return NextResponse.json({
      basic: basicTest,
      environment: envTest
    });
  } catch (error) {
    console.error('Simple test error:', error);
    return NextResponse.json(
      { 
        error: 'Simple test failed', 
        message: (error as Error).message,
        stack: (error as Error).stack 
      }, 
      { status: 500 }
    );
  }
}
