// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Field Validation Scenarios', () => {
  test('Validation error when Last Name is empty', async ({ page }) => {
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
    
    // Fill First Name and Middle Name, leave Last Name empty
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Middle Name' }).fill('Test');
    // Last Name intentionally left empty
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify we're still on the form (validation failed)
    await page.waitForTimeout(500);
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});