import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    // URL에서 HTML 가져오기
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // 개인정보처리방침 내용 추출
    const privacyContent = $('body').text(); // 본문 내용 (필요에 따라 구체화 가능)

    // AI 연동 API 호출
    const aiResponse = await fetch('http://localhost:3000/api/AIrouting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: privacyContent }),
    });

    if (!aiResponse.ok) {
      throw new Error('Failed to process data with AI');
    }

    const aiData = await aiResponse.json(); // AI의 응답 데이터
    return NextResponse.json({ aiResult: aiData });
  } catch (error) {
    console.error('Error during crawling or AI processing:', error);
    return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
  }
}
