import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');

    //Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to PIM section and add an employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.getByRole('link', { name: 'Add Employee' }).click();

    // Unique Employee Details
    const firstName = 'test';
    const lastName = 'user' + Date.now();
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    await page.getByRole('button', { name: 'Save' }).click();

    // Wait for the employee to be added successfully
    await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible({ timeout: 10000 });

    //click on Add Button

    await page.getByRole('button', { name: 'Add' }).click();

    //click on browse
    let fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByText('Browse').click();
    let fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('files/logo.png');
    await page.locator("//h6[text()='Add Attachment']/following-sibling::form//button[normalize-space()='Save']").click();

    // Download the uploaded file
    const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 100000 }),
        page.locator("i.bi-download").click()
    ]);
    const downloadPath = await download.saveAs('files/downloaded_logo.png');
    console.log(`Downloaded file path: ${downloadPath}`);
})  