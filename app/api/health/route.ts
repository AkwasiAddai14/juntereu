import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/mongoose';

export async function GET(request: NextRequest) {
  try {
    console.log('Health check: Starting...');
    
    // Test environment variables
    const requiredEnvVars = [
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      'MONGODB_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        status: 'unhealthy',
        error: 'Missing required environment variables',
        missing: missingVars,
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
    
    // Test database connection
    try {
      await connectToDB();
      console.log('Health check: Database connected successfully');
    } catch (dbError) {
      console.error('Health check: Database connection failed:', dbError);
      return NextResponse.json({
        status: 'unhealthy',
        error: 'Database connection failed',
        dbError: dbError instanceof Error ? dbError.message : 'Unknown database error',
        timestamp: new Date().toISOString()
      }, { status: 503 });
    }
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'connected'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Health check: Unexpected error:', error);
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
