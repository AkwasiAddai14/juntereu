import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/mongoose';
import Employer from '@/app/lib/models/employer.model';

export async function POST(request: NextRequest) {
  try {
    const { clerkId } = await request.json();
    
    console.log('Looking up employer for Clerk ID:', clerkId);
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Clerk ID is required' }, { status: 400 });
    }

    await connectToDB();
    
    const employer = await Employer.findOne({ clerkId }).lean();
    console.log('Found employer:', employer);
    
    if (!employer) {
      console.log('No employer found for Clerk ID:', clerkId);
      return NextResponse.json({ error: 'Employer not found' }, { status: 404 });
    }

    // Serialize the employer data
    const serializedEmployer = {
      ...employer,
      _id: employer._id?.toString(),
    };

    return NextResponse.json(serializedEmployer);
  } catch (error) {
    console.error('Error fetching employer by Clerk ID:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
