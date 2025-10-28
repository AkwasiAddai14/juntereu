import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/lib/mongoose';
import Application from '@/app/lib/models/application.model';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: 'Shift ID is required' }, { status: 400 });
    }

    await connectToDB();
    
    // Find applications for this shift
    const applications = await Application.find({ 
      'jobs.jobId': id 
    }).populate('employees.employeeId', 'voornaam achternaam profielfoto rating bio geboortedatum stad emailadres telefoonnummer facturen diensten').lean();
    
    // Serialize the applications data
    const serializedApplications = applications.map(app => ({
      ...app,
      _id: app._id?.toString(),
      employer: app.employer?.toString(),
      vacancy: app.vacancy?.toString(),
      jobs: app.jobs?.map(job => ({
        ...job,
        jobId: job.jobId?.toString()
      })) || [],
      employees: {
        ...app.employees,
        employeeId: app.employees.employeeId?._id?.toString(),
        name: app.employees.name,
        profilephoto: app.employees.profilephoto,
        rating: app.employees.rating,
        bio: app.employees.bio,
        dateOfBirth: app.employees.dateOfBirth,
        shifts: app.employees.shifts,
        city: app.employees.city,
        email: app.employees.email,
        phone: app.employees.phone,
      }
    }));

    return NextResponse.json(serializedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
