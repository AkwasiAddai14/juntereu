import { NextRequest, NextResponse } from 'next/server';
import { haalShiftMetId } from '@/app/lib/actions/shift.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }

    const shift = await haalShiftMetId(id);
    
    if (!shift) {
      return NextResponse.json({ error: 'Shift not found' }, { status: 404 });
    }

    return NextResponse.json(shift);
  } catch (error) {
    console.error('Error fetching shift:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
