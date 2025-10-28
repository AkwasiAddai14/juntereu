import { NextRequest, NextResponse } from 'next/server';
import { fixExpiredFutureShifts } from '@/app/lib/actions/shiftArray.actions';

export async function POST(request: NextRequest) {
  try {
    console.log('Fixing incorrectly expired future shifts...');
    const fixedCount = await fixExpiredFutureShifts();
    
    return NextResponse.json({ 
      success: true, 
      message: `Fixed ${fixedCount} future shifts`,
      fixedCount 
    });
  } catch (error: any) {
    console.error('Error fixing shifts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fix shifts',
      error: error.message 
    }, { status: 500 });
  }
}
