// Browser
// context
// page

// A Browser can have multiple contexts
// A context can have multiple pages
// A page can have multiple frames

// Context is like profile shares seperate memory
// With in context all pages share same memory
import { test, expect } from '@playwright/test';
test("working with pages example", async ({ page }) => {
    await page.goto("https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login");

    // Playwright Events
    let newPagePromise = page.context().waitForEvent("page");
    
    await page.getByText("Visit VibeTestQ").click();

    let newPage = await newPagePromise;

    // newPage.waitForURL("**/request-a-trial");
    
    await page.waitForTimeout(2000); // Wait for 2 seconds before interacting with the new page

    let [newPage1] = await Promise.all([
        page.context().waitForEvent("page"),
        newPage.getByRole("link", { name: "Request a Trial" }).first().click()
    ]);

    await newPage1.getByRole("textbox",{name: "Full Name"}).fill("John Doe");

    // await page.bringToFront();// bring the original page to the front

});