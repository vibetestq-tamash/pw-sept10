// Navigate To APSRTC Application
// Select From Location
// Select To Location
// Select Travel Date
// Click on Search Buses Button
// Verify Search Results
// click on select seats for 3658 service number
// Choose first bording point
// choose first droping point
// click on show layout
// Select any available seat
// Passenger Details and click on continue
// Verify journey details against the selected options

import { test, expect } from '@playwright/test';

test("APSRTC test", async ({ page }) => {
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

    // wait for search results to load
    await page.waitForSelector("div.srvceNO:visible");

    // click on select seats for a specific service number, e.g., 3658
    await page.locator(`//div[@class='srvceNO' and normalize-space()='3658']/../..//input[@value='Select Seats']`).click();

    // choose first boarding point
    await page.locator(`#ForwardBoardId`).selectOption({ index: 1 }); // select the first boarding point

    // read selected option text from select list
    // await page.locator(`select#ForwardBoardId option:checked`).textContent();

    let selectedBoardingPointDetails:string = await page.locator(`select#ForwardBoardId`).evaluate((el: HTMLSelectElement) => el.selectedOptions[0].textContent);
    console.log("Selected boarding point: " + selectedBoardingPointDetails);
    let selectedBoardingPoint = selectedBoardingPointDetails.trim().split(" - ")[0];
    let selectedBoardingPointTime = selectedBoardingPointDetails.trim().split(" - ")[1];
    
    // choose first dropping point
    await page.locator(`#ForwardDroppingId`).selectOption({ index: 1 }); // select the first dropping point

    //read selectedOptions dom attribute from the dropping point select list

    let selectedDroppingPointDetails:string = await page.locator(`select#ForwardDroppingId`).evaluate((el:HTMLSelectElement) => el.selectedOptions[0].textContent);
    console.log("Selected dropping point: " + selectedDroppingPointDetails);
    let selectedDroppingPoint = selectedDroppingPointDetails.trim().split(" - ")[0];
    let selectedDroppingPointTime = selectedDroppingPointDetails.trim().split(" - ")[1];

    // click on show layout
    await page.locator(`//input[@value='Show layout']`).click();

    // select available seat
    await page.locator("li.availSeatClassS").first().click(); // select the first available seat

});