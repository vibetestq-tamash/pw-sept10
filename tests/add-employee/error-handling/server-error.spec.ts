// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Error Handling and Recovery', () => {
  test('Handle server error response', async ({ page }) => {
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
    
    // Setup route to mock server error
    await page.route('**/api/**', route => {
      if (route.request().method() === 'POST') {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    // Fill employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('ServerError');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Wait for error response
    await page.waitForTimeout(1000);
    
    // Verify form is still usable
    const firstNameField = page.getByRole('textbox', { name: 'First Name' });
    await expect(firstNameField).toHaveValue('ServerError');
    
    // Verify we're still on the form
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
    
    // Clean up route mock
    await page.unroute('**/api/**');
    
    // Retry with working connection
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify eventual success
    await expect(page.locator('text=Successfully Saved')).toBeVisible({ timeout: 10000 });
  });
});