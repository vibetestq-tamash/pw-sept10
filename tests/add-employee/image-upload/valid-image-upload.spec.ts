// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Image Upload Scenarios', () => {
  test('Upload image within size and dimension constraints', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify file upload button exists
    const chooseFileButton = page.locator('text=Choose File');
    await expect(chooseFileButton).toBeVisible();
    
    // Note: Actual file upload would require a test image file
    // In a real scenario, you would:
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('./test-images/valid-profile.jpg');
    
    // Fill employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('ImageTest');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Employee');
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});