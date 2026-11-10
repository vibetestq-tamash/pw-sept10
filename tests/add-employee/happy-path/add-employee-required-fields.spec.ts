// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Happy Path Scenarios', () => {
  test('Successfully add employee with required fields only', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to PIM module
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    
    // Click Add Employee
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // Fill employee name fields
    await page.getByRole('textbox', { name: 'First Name' }).fill('John');
    await page.getByRole('textbox', { name: 'Middle Name' }).fill('Michael');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Anderson');
    
    // Verify Employee ID is auto-populated (5th input: after First/Middle/Last Name and File input)
    const employeeIdField = page.locator('input').nth(5);
    await expect(employeeIdField).toHaveValue(/^\d+$/);
    
    // Click Save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success message
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // Navigate to Employee List to verify employee was created
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify employee appears in list
    await expect(page.locator('text=John')).toBeVisible();
  });
});