// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Data Persistence and Verification', () => {
  test('View employee details after creation', async ({ page }) => {
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
    
    // Create employee with details
    const firstName = 'ViewDetails';
    const lastName = `Employee${Date.now()}`;
    const middleName = 'Test';
    
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(middleName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // The form should redirect or show employee details
    // Try to verify the employee name is displayed
    await expect(page.locator(`text=${firstName}`)).toBeVisible({ timeout: 5000 });
    
    // Try to navigate to Employee List to find and click on the employee
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Search for employee
    const searchField = page.locator('input[placeholder*="Search"]').first();
    if (await searchField.isVisible()) {
      await searchField.fill(lastName);
      await page.waitForLoadState('networkidle');
    }
    
    // Click on employee row to view details
    const employeeRow = page.locator(`text=${firstName}`);
    if (await employeeRow.isVisible()) {
      await employeeRow.click();
      await page.waitForLoadState('networkidle');
      
      // Verify details are displayed
      await expect(page.locator(`text=${firstName}`)).toBeVisible();
      await expect(page.locator(`text=${middleName}`)).toBeVisible();
      await expect(page.locator(`text=${lastName}`)).toBeVisible();
    }
  });
});