import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { privacyContent } = await req.json();

    // AI 서비스에 데이터 전송
    const aiResponse = await fetch('https://ai-service.com/api/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: privacyContent }),
    });

    const aiData = await aiResponse.json();
    return NextResponse.json(aiData);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process with AI' }, { status: 500 });
  }
}
