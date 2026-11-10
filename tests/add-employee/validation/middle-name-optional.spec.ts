// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Field Validation Scenarios', () => {
  test('Middle Name is optional', async ({ page }) => {
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
    
    // Fill only First Name and Last Name, skip Middle Name
    await page.getByRole('textbox', { name: 'First Name' }).fill('James');
    // Middle Name intentionally left empty
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Brown');
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success - middle name is optional
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});