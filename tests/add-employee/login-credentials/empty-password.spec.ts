// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test('Password validation - empty password', async ({ page }) => {
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
    
    // Enter employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('NoPassword');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Check Create Login Details
    const loginCheckbox = page.locator('input[type="checkbox"]');
    await loginCheckbox.check();
    
    // Fill username but leave password empty
    const usernameField = page.locator('input[placeholder*="username"]').or(page.locator('input[name*="username"]'));
    if (await usernameField.isVisible()) {
      await usernameField.fill('nopassword.test');
    }
    // Password left empty
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify form validation prevents save
    await page.waitForTimeout(500);
    
    // Should still be on form (validation failed)
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});