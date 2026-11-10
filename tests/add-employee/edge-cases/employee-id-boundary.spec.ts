// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Edge Cases and Boundary Conditions', () => {
  test('Employee ID auto-generation at boundary', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to Add Employee multiple times to test ID incrementing
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    
    const employeeIds = [];
    
    // Add 3 employees in succession
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Add Employee' }).click();
      await page.waitForLoadState('networkidle');
      
      // Capture Employee ID
      const employeeIdField = page.locator('input').nth(3);
      const idValue = await employeeIdField.inputValue();
      employeeIds.push(parseInt(idValue || '0'));
      
      // Fill employee details
      await page.getByRole('textbox', { name: 'First Name' }).fill(`BoundaryTest${i}`);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(`Employee${i}`);
      
      // Save
      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.locator('text=Successfully Saved')).toBeVisible();
      
      if (i < 2) {
        // Go back to PIM to add another
        await page.getByRole('link', { name: 'PIM' }).click();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Verify IDs are unique and sequential
    for (let i = 1; i < employeeIds.length; i++) {
      expect(employeeIds[i]).toBeGreaterThan(employeeIds[i - 1]);
    }
  });
});