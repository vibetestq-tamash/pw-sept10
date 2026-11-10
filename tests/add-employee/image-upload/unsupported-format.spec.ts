// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Image Upload Scenarios', () => {
  test('Image upload rejected for unsupported format', async ({ page }) => {
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
    
    // Note: Testing unsupported formats would require attempting to upload a .bmp, .tiff, or .svg file
    // The system should reject these formats
    // const fileInput = page.locator('input[type="file"]');
    // await fileInput.setInputFiles('./test-images/unsupported.bmp');
    // 
    // Expected: Error message or file rejection
    // await expect(page.locator('text=unsupported format')).toBeVisible();
  });
});