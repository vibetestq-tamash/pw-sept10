//Types of elements
// Buttons : click
// Checkboxes : check/uncheck
// Radio buttons : select
// Text fields : type
// Dropdowns/lists : select
// Links : click
// Images : click
// Links with images : click
// text elements like paragraphs, headings, spans, label, divs : read/verify


// Tables : read/verify
// Forms : fill/submit
// Popup/alerts : handle
// Frames : switch

// Mouse and Keyboard: Click, select, type
// Mouse Actions: hover, drag, drop, right-click, double-click, scroll

import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');

    //Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();

    // let b =await page.getByRole('button', { name: 'Login' }).boundingBox();
    // if (b) {
    //     console.log(`Login button position: x=${b.x}, y=${b.y}`);
    //     await page.getByRole('button', { name: 'Login' }).click({position: {x: b?.x+10, y: b?.y}})
    // }
    // Navigate to PIM section and add an employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Unique Employee Details
    const firstName = 'test';
    const lastName = 'user'+Date.now();
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for the employee to be added successfully
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({timeout: 10000});

    //Create User from Admin section
    await page.getByRole("link", { name: "Admin" }).click();
    await expect(page.getByRole("heading", { name: "System Users" })).toBeVisible();
    await page.getByRole("button", { name: "Add" }).click();
    await page.locator("//label[text()='User Role']/../..//div[text()='-- Select --']").click();
    await page.getByRole("option", { name: "ESS" }).click();

    //Enter employee first name and last name
    await page.locator("//label[text()='Employee Name']/../..//input").fill(firstName + " " + lastName);
    await page.getByRole("option", { name: firstName + " " + lastName }).click();

    // select Employee status
    await page.locator("//label[text()='Status']/../..//div[text()='-- Select --']").click();
    await page.getByRole("option", { name: "Enabled" }).click();

    // Enter Username
    let userName = firstName + lastName;
    await page.locator("//label[text()='Username']/../..//input").fill(userName);

    // Enter Password
    await page.locator("//label[text()='Password']/../..//input").fill('Vibetestq@123#');
    await page.locator("//label[text()='Confirm Password']/../..//input").fill('Vibetestq@123#');
    // Save the new admin user
    await page.getByRole("button", { name: "Save" }).click();

    // Verify that the new admin user is created successfully
    await expect(page.getByText("successfull")).toBeVisible();

    //logout
    await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    //login again to verify the newly createduser
    await page.getByRole('textbox', { name: 'Username' }).fill(userName);
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    // Navigate to My Info section
    await page.getByRole('link', { name: 'My Info' }).click();

    //wait for personal details
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({timeout: 10000});

    //select female radio button
    // await page.getByLabel("Female").click({force: true});    
    // await page.getByRole('radio', { name: 'Male', exact: true }).check();
    await page.getByText('Female', { exact: true }).click();

    //select marital status
    await page.locator("//label[text()='Marital Status']/../..//div[text()='-- Select --']").click();
    await page.getByRole("option", { name: "Married" }).click();

    //Enter DOB
    // await page.locator("//label[text()='Date of Birth']/../..//input").fill('1990-01-01');

    //Select DOB from Calendar
    await page.locator("//label[text()='License Expiry Date']/../..//i[contains(@class,'bi-calendar')]").click();
    
    //select year
    await page.locator("//div[@class='oxd-calendar-selector-year-selected']").click();
    await page.locator("//li[text()='1990']").click();

    //select month
    await page.locator("//div[@class='oxd-calendar-selector-month-selected']").click();
    await page.locator("//li[text()='January']").click();
    
    //select date
    await page.locator("//div[text()='27']").click();

    //click on save button
    await page.getByRole("button", { name: "Save" }).click();
    
    //verify success message
    await expect(page.getByText("Successfully Updated")).toBeVisible();
});

