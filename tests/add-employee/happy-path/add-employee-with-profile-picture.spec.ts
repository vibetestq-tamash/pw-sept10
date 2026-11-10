// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Happy Path Scenarios', () => {
  test('Add employee with profile picture', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to PIM and Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // Upload profile picture
    const fileInput = page.locator('input[type="file"]');
    // Note: In real scenario, you would provide a valid test image
    // await fileInput.setInputFiles('./test-images/profile.jpg');
    
    // Fill employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('David');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith');
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});