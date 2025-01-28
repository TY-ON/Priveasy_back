import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // 예: 페이지의 전체 텍스트를 추출
    const privacyContent = $('body').text();
    return NextResponse.json({ privacyContent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to crawl the page' }, { status: 500 });
  }
}
