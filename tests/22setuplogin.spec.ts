import { test, expect, Page } from '@playwright/test';

test("Authentication store", async ({ page }) => {

    //navigate to hrm
    await page.goto("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    await page.locator("//input[@placeholder='Username']").fill("testadmin");
    await page.locator('//input[@placeholder="Password"]').fill("Vibetestq@123#")
    await page.locator("//button[normalize-space()='Login']").click();
    await expect(page.locator("//h6[text()='Dashboard']")).toBeVisible();
    await page.context().storageState({ path: '.auth/user.json' });
})