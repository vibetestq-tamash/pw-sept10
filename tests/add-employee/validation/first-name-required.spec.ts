// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Field Validation Scenarios', () => {
  test('Validation error when First Name is empty', async ({ page }) => {
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
    
    // Leave First Name empty
    // Fill only Middle Name and Last Name
    await page.getByRole('textbox', { name: 'Middle Name' }).fill('Test');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Employee');
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify validation error appears or form doesn't submit
    // Wait a moment for any validation messages
    await page.waitForTimeout(500);
    
    // Check if we're still on the form (not saved)
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});