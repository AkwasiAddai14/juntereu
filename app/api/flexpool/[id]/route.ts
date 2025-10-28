import { NextRequest, NextResponse } from 'next/server';
import { haalFlexpool } from '@/app/lib/actions/flexpool.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Flexpool ID is required' }, { status: 400 });
    }

    const flexpool = await haalFlexpool(id);
    
    if (!flexpool) {
      return NextResponse.json({ error: 'Flexpool not found' }, { status: 404 });
    }

    // Serialize the flexpool data to avoid buffer objects
    const serializedFlexpool = {
      ...flexpool,
      _id: flexpool._id?.toString(),
      employer: flexpool.employer?.toString(),
      employees: flexpool.employees?.map((emp: any) => emp?.toString()) || [],
      shifts: flexpool.shifts?.map((shift: any) => shift?.toString()) || [],
    };

    return NextResponse.json(serializedFlexpool);
  } catch (error) {
    console.error('Error fetching flexpool:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
