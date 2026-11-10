// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Edge Cases and Boundary Conditions', () => {
  test('Add employee with only spaces in name', async ({ page }) => {
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
    
    // Enter only spaces in name fields
    await page.getByRole('textbox', { name: 'First Name' }).fill('     ');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('     ');
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify validation prevents save
    await page.waitForTimeout(500);
    
    // Should still be on form
    const addEmployeeHeading = page.locator('text=Add Employee');
    await expect(addEmployeeHeading).toBeVisible();
  });
});