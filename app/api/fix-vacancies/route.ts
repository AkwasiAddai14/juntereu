import { NextRequest, NextResponse } from 'next/server';
import { fixEmployerVacancies } from '@/app/lib/actions/vacancy.actions';

export async function POST(request: NextRequest) {
  try {
    console.log('Fixing employer-vacancy relationships...');
    const fixedCount = await fixEmployerVacancies();
    
    return NextResponse.json({ 
      success: true, 
      message: `Fixed ${fixedCount} employer-vacancy relationships`,
      fixedCount 
    });
  } catch (error: any) {
    console.error('Error fixing employer vacancies:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fix employer vacancies',
      error: error.message 
    }, { status: 500 });
  }
}
