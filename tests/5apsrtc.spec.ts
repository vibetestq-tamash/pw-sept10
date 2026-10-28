import { test, expect } from '@playwright/test';

test("APSRTC test",{tag: ['@smoke']}, async ({ page }) => {
    //navigate to APSRTC website
    await page.goto("https://www.apsrtconline.in/oprs-web/");
    await expect(page).toHaveTitle(/APSRTC/);

    let fromPlace = "hyderabad";
    let toPlace = "vijayawada";

    //enter from place and select from the suggestions
    await page.locator('#fromPlaceName').fill(fromPlace);
    await page.locator(`//span[text()='${fromPlace.toUpperCase()}']`).click();

    await page.locator('#toPlaceName').fill(toPlace);
    await page.locator(`//span[text()='${toPlace.toUpperCase()}']`).click();

    // click on date
    await page.locator('#txtJourneyDate').click();
    await page.locator(`//span[text()='October']/following::a[text()=30][1]`).click(); // select the 15th date of the current month

    // click on search button
    await page.locator('#searchBtn').click();

    //click on bus type
    await page.locator("span:has-text('Bus Type')").click(); // example to click on AC bus type

    await page.getByText("A/C CLASS", { exact: true }).click();

    let allServices = await page.locator("div.srvceNO:visible").all();
    console.log("All services count: " + allServices.length);

    for(let service of allServices){
        let srvNo = await service.textContent();
        console.log(srvNo?.trim()); 
    }

    await expect(page.locator("#fwTotalServicesId")).toHaveText(allServices.length.toString());
// //div[@class='srvceNO' and normalize-space()='3570']/../..//input[@value='Select Seats']
// //div[@class='row' and contains(normalize-space(),'3570')]//input[@value='Select Seats']


//span[text()='October']/following::a[text()=30][1]

    // String literal
    let user = "bhuvan"
    let saygreet = `Hello, ${user}!`; // string literal
    let saybye = "Goodbye,"+ user + "!"; //string concatenation
    console.log(saygreet);
    console.log(saybye);
});