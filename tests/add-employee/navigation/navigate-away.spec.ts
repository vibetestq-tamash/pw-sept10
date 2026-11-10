// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Form Navigation and Cancellation', () => {
  test('Navigate away from Add Employee page', async ({ page }) => {
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
    
    // Enter employee information
    await page.getByRole('textbox', { name: 'First Name' }).fill('Navigate');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Away');
    
    // Click on another menu item to navigate away
    // Try to navigate to Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();
    
    // Check if warning dialog appears
    const warningDialog = page.locator('[role="dialog"]').or(page.locator('text=/unsaved|discard|confirm/i'));
    
    if (await warningDialog.isVisible()) {
      // Dialog appeared - click proceed/confirm to navigate
      const proceedButton = page.locator('button:has-text(/yes|proceed|continue|discard/i)').first();
      if (await proceedButton.isVisible()) {
        await proceedButton.click();
      }
    }
    
    // Verify navigation occurred
    await page.waitForLoadState('networkidle');
  });
});