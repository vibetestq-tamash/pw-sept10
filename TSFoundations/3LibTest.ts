import {chromium} from "playwright"

//IIFE : Immediately Invoked Function Expression
(async function () {
    let browser = await chromium.launch({ headless: false });
    let context = await browser.newContext();
    let page = await context.newPage();

    // Navigate to a website
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/');

    console.log(await page.title());
    // Close the browser
    await browser.close();
})();

// npx tsx TSFoundations/3LibTest.ts
