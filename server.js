const express = require("express");
const app = express();
const puppeteer = require('puppeteer');

const jsdom = require("jsdom")
const { JSDOM } = jsdom
global.DOMParser = new JSDOM().window.DOMParser

const port = 5000;

app.listen(port, () => {
	console.log("excuted");
});

app.get("/", (request, response) => {
	response.send("success");
})

async function getData(url){
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

app.get("/privacy", async (request, response) => {
	const url = request.query.url;

	data = await getData(url);
	if (data) {
		var html_dom = new DOMParser().parseFromString(data, 'text/html');
		var victims = html_dom.querySelectorAll("a");
		var href = undefined;
		for (let i = 0; i < victims.length; i++) {
			const victim = victims[i];
			if (/개인.*정보.*처리.*방침/.test(victim.text)){
				href = victim.href;
				break;
			}
		}
	}
	else {
		response.send("failed");
		return;
	}
	
	if (href) {
		console.log(href);
		const privacy = await getData(href);

		response.send(privacy);
		return;
	}
	response.send("failed");
})