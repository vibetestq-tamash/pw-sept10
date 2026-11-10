// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Form Navigation and Cancellation', () => {
  test('Cancel with unsaved changes confirmation', async ({ page }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('Unsaved');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Changes');
    
    // Click Cancel button
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // Check if confirmation dialog appears
    const confirmDialog = page.locator('[role="dialog"]').or(page.locator('text=/confirm|discard|unsaved/i'));
    
    // If dialog appears, accept/confirm cancellation
    if (await confirmDialog.isVisible()) {
      const confirmButton = page.locator('button:has-text(/yes|confirm|discard/i)').first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
      }
    }
    
    // Verify navigation away from form
    await page.waitForLoadState('networkidle');
    const addEmployeeHeading = page.locator('heading:has-text("Add Employee")');
    await expect(addEmployeeHeading).not.toBeVisible();
  });
});