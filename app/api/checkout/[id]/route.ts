import { NextRequest, NextResponse } from 'next/server';
import { haalcheckout } from '@/app/lib/actions/checkout.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Checkout ID is required' }, { status: 400 });
    }

    const checkout = await haalcheckout({ shiftId: id });
    
    if (!checkout) {
      return NextResponse.json({ error: 'Checkout not found' }, { status: 404 });
    }

    // Serialize the checkout data to avoid buffer objects (checkout is a Shift document; its _id is the shift id)
    const serializedCheckout = {
      ...checkout,
      _id: checkout._id?.toString(),
      employer: checkout.employer?.toString(),
      employee: checkout.employee?.toString(),
      shift: checkout.shiftArrayId?.toString(),
    };

    return NextResponse.json(serializedCheckout);
  } catch (error) {
    console.error('Error fetching checkout:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
