const puppeteer = require('puppeteer');
const jsdom = require("jsdom")
const { JSDOM } = jsdom
global.DOMParser = new JSDOM().window.DOMParser

export async function getData(url: string): Promise<string>{
	const browser = await puppeteer.launch();
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

    const html_dom = new DOMParser().parseFromString(data, 'text/html');
    let href: string | undefined = undefined;

    function findPrivacyLink(element: Element | Document): string | undefined {
        const links = element.querySelectorAll<HTMLAnchorElement>("a[href]");
        for (const link of links) {
            if (/개인.*정보.*처리.*(방침|약관)/.test(link.textContent || "")) {
                return link.href;
            }
        }
        return undefined;
    }

    // 1. 푸터에서 먼저 검색
    const footer = html_dom.querySelector("footer");
    if (footer) {
        href = findPrivacyLink(footer);
    }

    // 2. 푸터에서 못 찾으면 전체 페이지 검색
    if (!href) {
        href = findPrivacyLink(html_dom);
    }

    if (href) {
        console.log(`Found Privacy Policy: ${href}`);
        const privacy = await getData(href);
        return privacy;
    }

    return "failed";
}
