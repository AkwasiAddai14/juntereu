import { NextRequest, NextResponse } from 'next/server';
import { generateAIFillData } from '@/app/lib/services/ai-fill.service';

export async function POST(request: NextRequest) {
  try {
    const { employer, documentType, existingDocuments } = await request.json();

    if (!employer || !documentType) {
      return NextResponse.json(
        { error: 'Missing required parameters: employer, documentType' },
        { status: 400 }
      );
    }

    const result = await generateAIFillData(
      employer,
      documentType as 'vacancy' | 'shift',
      existingDocuments
    );

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('AI Fill API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI fill data' },
      { status: 500 }
    );
  }
}
