// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test('Create login details for new employee', async ({ page }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('LoginTest');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Employee');
    
    // Check Create Login Details checkbox
    const loginCheckbox = page.locator('input[type="checkbox"]');
    await loginCheckbox.check();
    
    // Verify login detail text appears
    await expect(page.locator('text=Create Login Details')).toBeVisible();
    
    // Look for username and password fields that might appear
    const usernameField = page.locator('input[placeholder*="username"]').or(page.locator('input[name*="username"]'));
    const passwordField = page.locator('input[type="password"]');
    
    // If they exist, fill them
    if (await usernameField.isVisible()) {
      await usernameField.fill('logintest.employee');
    }
    if (await passwordField.isVisible()) {
      await passwordField.fill('TestPass@123');
    }
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});