import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, companyName, email, phone } = await request.json();

    // Validate required fields
    if (!name || !companyName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: name, companyName, and email are required' },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error('Missing environment variables for email configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create transporter (same as sendEmail.ts)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Send email to support@junter.works (same as sendEmail.ts)
    await transporter.sendMail({
      from: `"Get Access Form" <${emailUser}>`,
      to: 'support@junter.works',
      subject: 'New Get Access Request',
      html: `
        <h2>New Get Access Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone Number:</strong> ${phone}</p>` : ''}
        <hr>
        <p><em>This is an automated message from the Get Access form.</em></p>
      `,
    });

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    return NextResponse.json(
      { error: `Error sending email: ${error.message || error}` },
      { status: 500 }
    );
  }
}

