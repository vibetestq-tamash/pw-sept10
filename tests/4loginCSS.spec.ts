import { test, expect, Page } from '@playwright/test';

test("Login test", async ({ page }) => {

    //navigate to hrm
    await page.goto("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    await page.locator("//input[@placeholder='Username']").fill("testadmin");
    await page.locator('//input[@placeholder="Password"]').fill("Vibetestq@123#")
    await page.locator("//button[normalize-space()='Login']").click();
    await expect(page.locator("//h6[text()='Dashboard']")).toBeVisible()
})

// Developer use css for styling and selecting elements
// they can access the elements and apply styles or perform actions on them using CSS selectors
/* 
    How do they select elements using CSS selectors?
    - By tag name: tagname
    - By ID: #id
    - By class: .classname
    - By attribute: [attribute="value"]
    - By pseudo-classes: :hover, :nth-child(n), :visible
    - By combinators: descendant (space), child (>), adjacent sibling (+), general sibling (~)


*/

//page.locator("xpath or css selector")
// Example usage:
// await page.locator("css=selector").click();
// await page.locator("xpath=//xpath").click();

// Xpath: To find an element using its XPath

// /: Selects from the root node
// absolute xpath: Starts from the root node and follows the full path to the element
// Example: html/body/div[1]/div[2]/button

// > for / in xpath
// xpath: html/body/div[1]/div[2]/button
// css: html>body>div:nth-child(1)>div:nth-child(2)>button

// //: Selects from the current node
// //input[@name="username"]
// //tagname[@attribute="value"]
// css: tagname[attribute="value"]
// @ is not required for using CSS attribute selectors

// //h5[text()='Login'] //tagname[function()="value"]
// we cannot use text content directly in CSS selectors
// to handle this playwright gave us the 
// :has-text(), :has()
// Example usage:
// page.locator('div:has-text("Login")')
// page.locator('div:has(div:has-text("Login"))')

// We can use either attribute or text content to locate elements using XPath

//button[text()=" Login "]
//button[normalize-space()="Login"]

// Playwright equivalent for CSS selectors using text content is :has-text()
//button:has-text("Login")
// xpath: //button[normalize-space()="Login"]
// playwright css: button:text-is("Login")

// More information on other locators can be found at:
// https://playwright.dev/docs/other-locators

// tagname[attribute="value"]
// .classname
// #id
// tagname.classname
// tagname#id
// tagname[attribute="value"]
// i.oxd-icon.bi-pencil-fill
// tagname.class1.class2
// tagname#id.classname