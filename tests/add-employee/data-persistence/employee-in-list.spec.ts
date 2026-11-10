// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Data Persistence and Verification', () => {
  test('Verify employee appears in employee list after creation', async ({ page }) => {
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
    
    // Create unique employee name for search
    const uniqueName = `Persistence${Date.now()}`;
    const firstName = 'Persist';
    const lastName = uniqueName.substring(0, 30);
    
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // Navigate to Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Search for the employee
    const searchField = page.locator('input[placeholder*="Search"]').first();
    if (await searchField.isVisible()) {
      await searchField.fill(lastName);
      await page.waitForLoadState('networkidle');
    }
    
    // Verify employee appears in list
    await expect(page.locator(`text=${firstName}`)).toBeVisible();
  });
});