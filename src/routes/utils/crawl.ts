const puppeteer = require('puppeteer');
import * as cheerio from 'cheerio';

export async function getData(url: string): Promise<string>{
	const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-gpu',
        ],
     });
	const page = await browser.newPage();
	await page.goto(url);
	await page.waitForFunction(
		'window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 500'
	);
	const data = await page.content();
	await browser.close();
	return data;
}

export async function crawlPrivacy(url: string): Promise<string> {
    if (!url) {
        return "failed";
    }

    let data: string = await getData(url);
    if (!data) {
        return "failed";
    }

    const html = cheerio.load(data);
    let href: string | undefined = undefined;

    function findPrivacyLink(element: cheerio.Cheerio): string | undefined {
        for (const link of element.find("a")) {
            if (/개인.*정보.*처리.*(방침|약관)/.test(html(link).text() || "")) {
                return html(link).attr('href');
            }
        }
        return undefined;
    }

    // 1. 푸터에서 먼저 검색
    const footer = html("footer");
    if (footer) {
        href = findPrivacyLink(footer);
    }

    // 2. 푸터에서 못 찾으면 전체 페이지 검색
    if (!href) {
        href = findPrivacyLink(html('html'));
    }

    if (href) {
        console.log(`Found Privacy Policy: ${href}`);
        const privacy = await getData(href);
        
        const $ = cheerio.load(privacy);
        $('head').remove();
        $('script').remove();
        $('style').remove();
        $('#header').remove();
        $('.header').remove();
        $('#footer').remove();
        $('.footer').remove();
        const privacyContent = $('body').text();
        if (privacyContent){
            return privacyContent;
        }
        return "failed";
    }

    return "failed";
}
