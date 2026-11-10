// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Edge Cases and Boundary Conditions', () => {
  test('Rapid successive employee additions', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    
    // Add employees rapidly
    for (let i = 0; i < 3; i++) {
      await page.getByRole('link', { name: 'Add Employee' }).click();
      await page.waitForLoadState('networkidle');
      
      // Fill details
      await page.getByRole('textbox', { name: 'First Name' }).fill(`Rapid${i}`);
      await page.getByRole('textbox', { name: 'Last Name' }).fill(`Employee${i}`);
      
      // Save immediately
      await page.getByRole('button', { name: 'Save' }).click();
      
      // Verify success
      await expect(page.locator('text=Successfully Saved')).toBeVisible({ timeout: 5000 });
      
      // Small delay before next iteration
      await page.waitForTimeout(200);
      
      if (i < 2) {
        // Go back for next employee
        await page.getByRole('link', { name: 'PIM' }).click();
        await page.waitForLoadState('networkidle');
      }
    }
  });
});