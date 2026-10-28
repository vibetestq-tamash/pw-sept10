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

    await page.locator("img.employee-image").click();

    // Upload a file

    let fileChooserPromise = page.waitForEvent("filechooser");
    await page.locator("button.employee-image-action").click();
    let fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('files/logo.png');

    // let [fileChooser] = await Promise.all([
    //     page.waitForEvent("filechooser"),
    //     page.locator("button.employee-image-action").click(),
    // ]);
    // await fileChooser.setFiles('files/logo.png')


    // page.once("filechooser", async (fileChooser) => {
    //     await page.waitForTimeout(5000); // Wait for the file chooser to be ready
    //     await fileChooser.setFiles('files/logo.png');
    // });

    await page.locator("button.employee-image-action").click();

    await page.getByRole('button', { name: 'Save' }).click();
    // page.on("download", (download) => {
    //     console.log(`Download started: ${download.url()}`);
    // });

    /*
    // Select one file
    await page.getByLabel('Upload file').setInputFiles('files/logo.png');

    // Select multiple files
    await page.getByLabel('Upload files').setInputFiles([
        file1path,
        file2path
    ]);

    */
})  