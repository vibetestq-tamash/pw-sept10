// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Input Data Scenarios', () => {
  test('Add employee with leading and trailing spaces', async ({ page }) => {
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
    
    // Enter names with leading/trailing spaces
    await page.getByRole('textbox', { name: 'First Name' }).fill('  John  ');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('  Doe  ');
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});