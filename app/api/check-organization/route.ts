import { NextRequest, NextResponse } from 'next/server';
import { isUserInOrganization } from '@/app/lib/utils/organization';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Starting organization check...');
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
