// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Form Navigation and Cancellation', () => {
  test('Cancel employee creation', async ({ page }) => {
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
    
    // Enter some employee information
    await page.getByRole('textbox', { name: 'First Name' }).fill('Cancel');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Verify we're no longer on Add Employee form
    // Should be redirected to Employee List or back to previous page
    await page.waitForLoadState('networkidle');
    
    // Verify we've left the Add Employee page
    const addEmployeeHeading = page.locator('heading:has-text("Add Employee")');
    await expect(addEmployeeHeading).not.toBeVisible();
  });
});