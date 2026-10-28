import { test, expect } from '@playwright/test';
test('interact with shadow DOM', async ({ page }) => {

    await page.goto('https://vibetestq.com/testweb/sandbox/'); // Replace with the actual URL containing the shadow DOM
    await page.getByText("Drag, Drop & Shadow").click();
    await page.locator("#shadow-txt").fill("Hello Shadow DOM");

    // Xpath not supported to work with shadow dom

    //CSS limitation is traversing back to parent or preceding
    // And also using text content to locate elements
    // use playwright css locators
})