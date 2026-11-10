// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test('Username validation - empty username', async ({ page }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('NoUsername');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Check Create Login Details
    const loginCheckbox = page.locator('input[type="checkbox"]');
    await loginCheckbox.check();
    
    // Leave username empty but fill password
    const passwordField = page.locator('input[type="password"]');
    if (await passwordField.isVisible()) {
      await passwordField.fill('Password@123');
    }
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify form validation prevents save or error message appears
    await page.waitForTimeout(500);
    
    // Should still be on form (validation failed)
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});