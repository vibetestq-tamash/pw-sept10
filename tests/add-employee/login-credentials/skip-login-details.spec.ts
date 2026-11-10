// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Login Credentials Scenarios', () => {
  test('Skip login detail creation', async ({ page }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('NoLogin');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Employee');
    
    // Do NOT check Create Login Details checkbox
    // The checkbox should remain unchecked by default
    
    // Verify checkbox is unchecked
    const loginCheckbox = page.locator('input[type="checkbox"]');
    await expect(loginCheckbox).not.toBeChecked();
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success - employee saved without login details
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});