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

export async function crawlPrivacy(url: string): Promise<string>{

    if (!url){
        return "failed";
    }

	let data: string = await getData(url);
	if (data) {
		var html_dom = new DOMParser().parseFromString(data, 'text/html');
		var victims = html_dom.querySelectorAll("a");
		var href = undefined;
		for (let i = 0; i < victims.length; i++) {
			const victim = victims[i];
			if (/개인.*정보.*처리.*(방침|약관)/.test(victim.text)){
				href = victim.href;
				break;
			}
		}
	}
	else {
		return "failed";
	}
	
	if (href) {
		console.log(href);
		const privacy = await getData(href);
		return privacy;
	}
	return "failed";
}