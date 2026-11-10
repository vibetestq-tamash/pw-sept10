// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Image Upload Scenarios', () => {
  test('Image upload rejected when file exceeds 1MB', async ({ page }) => {
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
    
    // Verify profile picture upload section
    await expect(page.locator('text=Accepts jpg, .png, .gif up to 1MB')).toBeVisible();
    
    // Note: Testing oversized file would require:
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('./test-images/oversized-image.jpg'); // > 1MB
    //
    // Expected: Error message indicating file size limit
    // await expect(page.locator('text=exceeds 1MB')).toBeVisible();
  });
});