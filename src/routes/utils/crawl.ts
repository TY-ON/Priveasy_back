const puppeteer = require('puppeteer');
import * as cheerio from 'cheerio';
import { delay } from './util';

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
	await page.setExtraHTTPHeaders({ 
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
		'upgrade-insecure-requests': '1', 
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
		'accept-encoding': 'gzip, deflate, br', 
		'accept-language': 'ko-KR, en-US' 
	}); 

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
            if (/개인.*정보.*(처리).*(방침|약관)|Privacy.*Policy/i.test(html(link).text() || "")) {
				return html(link).attr('href');
            }
        }
        return undefined;
    }

	
    function findPrivacyLinkUrl(element: cheerio.Cheerio): string | undefined {
        for (const link of element.find("a")) {
			// 못 찾음 -> url에서 다시 탐색
			for (const link of element.find("a")) {
				if (/^\/privacy|^https:\/\/.*\/privacy/i.test(html(link).attr('href') || "")) {
					return html(link).attr('href');
				}
			}
        }
        return undefined;
    }

    // 1. 푸터에서 먼저 검색
    const footer = html("#footer");
    if (footer) {
        href = findPrivacyLink(footer);
		if (!href){
			href = findPrivacyLinkUrl(footer);
		}
    }

    // 2. 푸터에서 못 찾으면 전체 페이지 검색
    if (!href) {
        href = findPrivacyLink(html('html'));
		if (!href){
			href = findPrivacyLinkUrl(html('html'));
		}
    }

    if (href) {
		if (!/^https?:\/\//.test(href)){
			href = url + href;
		}
		delay(1000);
		console.log(href);
		let privacy: string | undefined = undefined;
		try {
			privacy = await getData(href);
		} catch (error) {
			href = findPrivacyLinkUrl(html('html'));
			if (href){
				if (!/^https?:\/\//.test(href)){
					href = url + href;
				}
				console.log(href);
				privacy = await getData(href);	
			}
		}
        
		if (privacy){
			const $ = cheerio.load(privacy);
			$('head').remove();
			$('script').remove();
			$('style').remove();
			$('#header').remove();
			$('.header').remove();
			$('#footer').remove();
			$('.footer').remove();
			$('iframe').remove();
			const privacyContent = $('body').text();
			if (privacyContent){
				return privacyContent;
			}
		}

        return "failed";
    }

    return "failed";
}
