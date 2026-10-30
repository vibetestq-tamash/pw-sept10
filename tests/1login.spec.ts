import { test, expect, Page } from '@playwright/test';

// Syntax for creating test
// test("description",async ({page})=>{
// write all statements
// })

test("Login test", {tag: '@smoke'}, async ({ page }) => {

    //navigate to hrm
    await page.goto("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    await page.getByPlaceholder("Username").fill("testadmin");
    await page.getByPlaceholder("Password").fill("Vibetestq@123#");
    await page.getByRole("button", { name: "Login" }).click();
})

// mocha, jest, jasmine are other testing frameworks for JavaScript

async function login(page: Page, userName: string, password: string) {
    await page.getByPlaceholder("Username").fill(userName);
}


//getbyalttext example: To find an element by its alt text attribute
// Element types that contain alt text include <img>, <input type="image" alt="google">
// await page.getByAltText("alt text here").click();

//getbylabel example: To find an element by its label text
// Element types that can have associated labels include <input>, <textarea>, <select>
// await page.getByLabel("Label Text Here").fill("value");

//getbyplaceholder example: To find an element by its placeholder attribute
// Element types that can have a placeholder include <input>, <textarea>
// await page.getByPlaceholder("Placeholder Text Here").fill("value");

//getbyrole example: To find an element by its role attribute
// Common roles include "button", "link", "checkbox", "radio", "textbox", etc.
// await page.getByRole("role", {name: "accessible name"}).click();

//getbytext example: To find an element by its exact text content
// Element types that can have text content include <button>, <a>, <div>, <span>, etc.
// await page.getByText("Exact Text Here").click();

//getbytestid example: To find an element by its data-testid attribute
// Element types that can have a data-testid include <div>, <span>, <input>, <button>, etc.
// await page.getByTestId("test-id-here").click();

//getbytitle example: To find an element by its title attribute
// Element types that can have a title include <a>, <div>, <span>, <input>, <button>, etc.
// await page.getByTitle("title-here").click();

//page.locator("xpath or css selector")
// Example usage:
// await page.locator("css=selector").click();
// await page.locator("xpath=//xpath").click();