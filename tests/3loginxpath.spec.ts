import { test, expect, Page } from '@playwright/test';

test("Login test", async ({ page }) => {

    //navigate to hrm
    await page.goto("https://qtpsudhakar-vibetestq-hrm.up.railway.app");
    await page.locator("//input[@placeholder='Username']").fill("testadmin");
    await page.locator('//input[@placeholder="Password"]').fill("Vibetestq@123#")
    await page.locator("//button[normalize-space()='Login']").click();
    await expect(page.locator("//h6[text()='Dashboard']")).toBeVisible()
})
//div[@role='row' and contains(normalize-space(),'512400821')]
// locator("div[role='row']:has-text('512400821')")

// locator("i.bi-trash").within(locator("div[role='row']:has-text('512400821')"))

//page.locator("xpath or css selector")
// Example usage:
// await page.locator("css=selector").click();
// await page.locator("xpath=//xpath").click();

// Xpath: To find an element using its XPath

// /: Selects from the root node
// absolute xpath: Starts from the root node and follows the full path to the element
// Example: /html/body/div[1]/div[2]/button

// //: Selects from the current node
// //input[@name="username"]
// //tagname[@attribute="value"]
// //h5[text()='Login']

// //tagname[function()="value"]

// We can use either attribute or text content to locate elements using XPath

//button[text()=" Login "]
//button[normalize-space()="Login"]

// Use Partial Attributes or text content to locate elements using XPath

//tagname[contains(@attribute, "partial value")]
//tagname[contains(text(), "partial text")]
//tagname[starts-with(@attribute, "partial value")]
//tagname[contains(@normalize-space(), "partial value")]

// using and not or
//tagname[@attribute="value" and text()="text value" or @anotherattribute="anothervalue"]
//tagname[@attribute="value" and not(text()="text value") or @anotherattribute="anothervalue"]
//tagname[@attribute="value" and text()="text value"]
//tagname[@attribute="value" and not(text()="text value")]

// It follows same human logic as we use in natural language for combining conditions

// Family hierarchy in XPath
// parent::tagname
// ancestor::tagname
// child::tagname
// descendant::tagname
// following-sibling::tagname
// preceding-sibling::tagname
// self::tagname
// following::tagname
// preceding::tagname

// parentXpath/child
// grandparentXpath//child
// ancestorXpath//descendant

// ChildXpath/..  --> ParentXpath
// ChildXpath/ancestor::tagname  --> AncestorXpath
// Xpath/following-sibling::tagname  --> FollowingSiblingXpath
// Xpath/preceding-sibling::tagname  --> PrecedingSiblingXpath
// Xpath/following::tagname  --> FollowingXpath
// Xpath/preceding::tagname  --> PrecedingXpath

//td[text()='Last Name:']/following-sibling::td/input
//td[text()='Last Name:']/..//input
//label[text()='Employee Id']/../..//input

// up/down/left/right

// Step1: Find the related element xpath
// Step2: observe what is common parent between related and target elements
// Step3: Create xpath from related element to common parent element
// Step4: Create xpath from common parent element to target element


// Syntax for axes
// Xpath/axes::tagname

//label[text()='Employee Id']/ancestor::div[contains(@class,"oxd-input-group ")]//input
//label[text()='Employee Id']/../..//input
// descendant::tagname

//div[@class="oxd-input-group oxd-input-field-bottom-space" and descendant::label[text()="Employee Id"]]
//div[@class="oxd-input-group oxd-input-field-bottom-space" and descendant::label[text()="Employee Id"]]//input

//div[@class="srvceNO" and ancestor::div[@style="display: none;"]]
//div[@class="srvceNO" and not(ancestor::div[@style="display: none;"])]

// div.srvceNO:visible

// shadow dom
// shadowRoot.querySelector('selector')