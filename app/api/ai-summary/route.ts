import { NextRequest, NextResponse } from 'next/server';
import { generateAISummary } from '@/app/lib/ai-summary-server';

export async function POST(request: NextRequest) {
  try {
    const { section, userData } = await request.json();
    
    const summary = await generateAISummary({ section, userData });
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
