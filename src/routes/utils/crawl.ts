const puppeteer = require('puppeteer');
import * as cheerio from 'cheerio';
import { delay } from './util';

export async function getData(url: string, browser: any): Promise<{ data: string, page: any }> {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'ko-KR, en-US'
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const data = await page.content();
    return { data, page }; // 페이지를 닫지 않고 반환
}

export async function crawlPrivacy(url: string): Promise<string> {
    if (!url) return "failed";

    const browser = await puppeteer.launch({ 
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',

          ],    
    });
    let page;



    try {
        let result = await getData(url, browser);
        let data = result.data;
        page = result.page;

        if (!data) return "failed";

        const html = cheerio.load(data);
        let href: string | undefined = undefined;

        async function findClickablePrivacyButton(page: any): Promise<string | null> {
            try {
                const selector = [
                    'a',
                    'button',
                    'input[type="submit"]',
                    '[role="button"]',
                    'li.cursor-pointer',
                    '.clickable',
                    '.btn',
                    '[onclick]'
                ].join(', ');

                const searchText = /개인.*정보.*(처리).*(방침|약관)|Privacy.*Policy/i;
                const elements = await page.$$(selector);

                if (!elements.length) {
                    console.warn(`No clickable elements (${selector}) found.`);
                    return null;
                }

                for (const element of elements) {
                    const text = await page.evaluate((el:HTMLElement) => el.innerText?.trim(), element);
                    if (!text) continue;

                    if (searchText.test(text)) {
                        console.log(`Found clickable element: "${text}". Checking visibility...`);

                        // 요소가 화면에 있는지 확인
                        const box = await element.boundingBox();
                        if (!box) {
                            console.warn("Element is not visible, skipping...");
                            continue;
                        }

                        if (page.isClosed()) {
                            console.warn("Page is already closed. Skipping...");
                            return null;
                        }

                        // 클릭 후 페이지 이동 여부 체크 (최대 10초 기다림)
                        await page.evaluate((el:HTMLElement)=> el.click(), element);
                        await Promise.all([
                            page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => null),
                            delay(5000)
                        ]);

                        const newUrl = page.url();
                        console.log("Redirected to Privacy Policy Page:", newUrl);

                        const privacyContent = await getData(newUrl, browser);
                        return cleanText(privacyContent.data);
                    }
                }
            } catch (error) {
                console.error("Error finding clickable privacy button:", error);
            }
            return null;
        }

        function findPrivacyLink(element: cheerio.Cheerio): string | undefined {
            let best_link: string | undefined = undefined;
            let min_length = 1000;

            for (const link of element.find("a")) {
                const href = html(link).attr('href');
                const text = html(link).text().replace(/\s/g, "");
                console.log(href, text, text.length);
                if (/개인.*정보.*(처리).*(방침|약관)|Privacy.*Policy/i.test(text || "")) {
                    if (min_length > text.length){
                        best_link = href;
                        min_length = text.length;
                    }
                }
            }

            return best_link;
        }

        function findPrivacyLinkUrl(element: cheerio.Cheerio): string | undefined {
            let bestLink: string | undefined = undefined;
            let maxScore = 0;
        
            for (const link of element.find("a")) {
                const href = html(link).attr('href');
                if (!href) continue;
        
                //  키워드 포함 개수 계산 (privacy에 가중치 부여)
                const keywords = ["privacy", "policy", "terms", "legal", "agreement", "service"];
                let score = keywords.reduce((acc, keyword) => acc + (href.match(new RegExp(keyword, "gi"))?.length || 0), 0);
        
                //  "privacy" 포함 여부를 최우선 기준으로 반영
                if (/privacy/i.test(href)) score += 5; //privacy에 추가 가중치
        
                // 기존 정규식 적용하여 필터링
                if (/^(\/.*privacy|\/.*policy|\/.*terms|\/.*legal)|^https:\/\/.*(privacy|policy|terms|legal)/i.test(href)) {
                    if (score > maxScore) {
                        maxScore = score;
                        bestLink = href;
                    }
                }
            }
            console.log(bestLink);
            return bestLink;
        }
        
        

        function cleanText(htmlContent: string): string {
            const $ = cheerio.load(htmlContent);
            $('head, script, style, #header, .header, #footer, .footer, iframe').remove();
            return $('body').text().trim();
        }

        //  1. 푸터에서 개인정보처리방침 링크 찾기
        const footer = html("#footer,footer,.footer");
        if (footer) {
            href = findPrivacyLinkUrl(footer) || findPrivacyLink(footer);
            if (!href) {
                console.log("Checking for clickable privacy button in footer...");
                const clickedPrivacyData = await findClickablePrivacyButton(page);
                if (clickedPrivacyData) {
                    if (!page.isClosed()) await page.close();
                    return clickedPrivacyData;
                }
            }
        }

        //  2. 푸터에서 못 찾으면 전체 페이지 검색
        if (!href) {
            href = findPrivacyLink(html('html')) || findPrivacyLinkUrl(html('html'));
            if (!href) {
                console.log("Checking for clickable privacy button in full page...");
                const clickedPrivacyData = await findClickablePrivacyButton(page);
                if (!page.isClosed()) await page.close();
                if (clickedPrivacyData) return clickedPrivacyData;
            }
        }

        if (!page.isClosed()) await page.close();

        if (href) {
            let finalUrl = href.startsWith("http") ? href : new URL(href, url).href;
            delay(1000);
            console.log("Trying Privacy Policy URL:", finalUrl);

            try {
                const privacyData = await getData(finalUrl, browser);
                if (privacyData.data) {
                    await privacyData.page.close();                    
                    return cleanText(privacyData.data);
                }

                if(!privacyData.page.isClosed()) await privacyData.page.close();
            } catch (error) {
                console.warn("Failed to fetch privacy policy:", error);
            }
        }
    } catch (error) {
        console.error("Error during crawling:", error);
    } finally {
        if (browser) await browser.close();
    }

    return "failed";
}
