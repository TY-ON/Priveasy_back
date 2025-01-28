import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { content } = await req.json(); // 크롤링 후 파싱된 데이터

    // AI 서비스로 데이터 전송
    const aiResponse = await fetch('https://ai-service.com/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }), // AI 서비스가 처리할 텍스트
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to communicate with AI service');
    }

    const aiData = await aiResponse.json(); // AI 서비스의 응답 데이터
    return NextResponse.json({ aiResult: aiData }); // 클라이언트로 반환
  } catch (error) {
    console.error('AI Service Error:', error);
    return NextResponse.json({ error: 'AI service failed' }, { status: 500 });
  }
}
