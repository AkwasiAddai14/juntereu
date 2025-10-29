import { NextRequest, NextResponse } from 'next/server';
import { isUserInOrganization } from '@/app/lib/utils/organization';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting organization check...');
    
    // Check if required environment variables are available
    if (!process.env.MONGODB_URL) {
      console.error('API: MONGODB_URL not configured');
      return NextResponse.json(
        { 
          isInOrganization: false,
          success: false,
          error: 'Database not configured' 
        },
        { status: 503 }
      );
    }
    
    const isInOrganization = await isUserInOrganization();
    console.log('API: Organization check result:', isInOrganization);
    
    return NextResponse.json({ 
      isInOrganization,
      success: true 
    });
  } catch (error) {
    console.error('API: Error checking organization:', error);
    return NextResponse.json(
      { 
        isInOrganization: false,
        success: false,
        error: 'Failed to check organization membership' 
      },
      { status: 500 }
    );
  }
}
