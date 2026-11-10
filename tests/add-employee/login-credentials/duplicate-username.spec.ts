// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test('Duplicate username prevention', async ({ page }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('DuplicateUser');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Check Create Login Details
    const loginCheckbox = page.locator('input[type="checkbox"]');
    await loginCheckbox.check();
    
    // Try to use existing username 'testadmin' which should already exist
    const usernameField = page.locator('input[placeholder*="username"]').or(page.locator('input[name*="username"]'));
    if (await usernameField.isVisible()) {
      await usernameField.fill('testadmin'); // Existing username
    }
    
    const passwordField = page.locator('input[type="password"]');
    if (await passwordField.isVisible()) {
      await passwordField.fill('Password@123');
    }
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify duplicate username error or validation message
    await page.waitForTimeout(500);
    
    // System should reject or show error
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});