import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'SET' : 'NOT SET',
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'SET' : 'NOT SET',
        MONGODB_URL: process.env.MONGODB_URL ? 'SET' : 'NOT SET',
        OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET',
        UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET ? 'SET' : 'NOT SET',
        UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID ? 'SET' : 'NOT SET',
        UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN ? 'SET' : 'NOT SET',
      },
      database: {
        MONGODB_NL_URL: process.env.MONGODB_NL_URL ? 'SET' : 'NOT SET',
        MONGODB_BE_URL: process.env.MONGODB_BE_URL ? 'SET' : 'NOT SET',
        MONGODB_FR_URL: process.env.MONGODB_FR_URL ? 'SET' : 'NOT SET',
        MONGODB_DE_URL: process.env.MONGODB_DE_URL ? 'SET' : 'NOT SET',
        MONGODB_ES_URL: process.env.MONGODB_ES_URL ? 'SET' : 'NOT SET',
        MONGODB_IT_URL: process.env.MONGODB_IT_URL ? 'SET' : 'NOT SET',
        MONGODB_PT_URL: process.env.MONGODB_PT_URL ? 'SET' : 'NOT SET',
      },
      apiKeys: {
        NEXT_PUBLIC_KVK_API_KEY: process.env.NEXT_PUBLIC_KVK_API_KEY ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_POSTCODE_API_KEY: process.env.NEXT_PUBLIC_POSTCODE_API_KEY ? 'SET' : 'NOT SET',
        NEXT_PUBLIC_GEOCODE_API_KEY: process.env.NEXT_PUBLIC_GEOCODE_API_KEY ? 'SET' : 'NOT SET',
      },
      email: {
        EMAIL_HOST: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
        EMAIL_PORT: process.env.EMAIL_PORT ? 'SET' : 'NOT SET',
        EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      },
      firebase: {
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'SET' : 'NOT SET',
        PROJECT_ID: process.env.PROJECT_ID ? 'SET' : 'NOT SET',
      }
    };

    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
