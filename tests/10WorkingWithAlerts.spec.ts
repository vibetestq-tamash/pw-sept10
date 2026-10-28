import { test, expect } from '@playwright/test';

test("APSRTC test", async ({ page }) => {
    //navigate to APSRTC website
    await page.goto("https://www.apsrtconline.in/oprs-web/");
    await expect(page).toHaveTitle(/APSRTC/);

    let fromPlace = "hyderabad";
    let toPlace = "vijayawada";

    // let dialogPromise = page.waitForEvent("dialog");
    // // click on search button
    // await page.locator('#searchBtn').click();
    // let dialog = await dialogPromise;
    // console.log(`Dialog message: ${dialog.message()}`);
    // await page.waitForTimeout(2000); // Wait for 1 second before accepting the dialog
    // await dialog.accept();


    page.once("dialog", async (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        expect(dialog.message()).toContain("Please select start place.");
        await page.waitForTimeout(2000); // Wait for 2 seconds before accepting the dialog
        await dialog.dismiss();
    });

    await page.locator('#searchBtn').click();

    //enter from place and select from the suggestions
    await page.locator('#fromPlaceName').fill(fromPlace);
    await page.locator(`//span[text()='${fromPlace.toUpperCase()}']`).click();

    page.once("dialog", async (dialog) => {
        console.log(`Dialog message: ${dialog.message()}`);
        expect(dialog.message()).toContain("Please select end place.");
        await page.waitForTimeout(2000); // Wait for 2 seconds before accepting the dialog
        await dialog.dismiss();
    });
    // click on search button
    await page.locator('#searchBtn').click();

    await page.locator('#toPlaceName').fill(toPlace);
    await page.locator(`//span[text()='${toPlace.toUpperCase()}']`).click();

    // click on date
    await page.locator('#txtJourneyDate').click();
    await page.locator(`//span[text()='October']/following::a[text()=30][1]`).click(); // select the 15th date of the current month

    // click on search button
    await page.locator('#searchBtn').click();

});