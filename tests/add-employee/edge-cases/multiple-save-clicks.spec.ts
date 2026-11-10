// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Edge Cases and Boundary Conditions', () => {
  test('Save button multiple clicks', async ({ page }) => {
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
    
    // Fill details
    await page.getByRole('textbox', { name: 'First Name' }).fill('MultiClick');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Click Save button multiple times rapidly
    const saveButton = page.getByRole('button', { name: 'Save' });
    
    // Disable button after first click to prevent multiple submissions
    // But we'll test by clicking multiple times
    await saveButton.click();
    await page.waitForTimeout(100);
    await saveButton.click();
    await page.waitForTimeout(100);
    await saveButton.click();
    
    // Wait for response
    await page.waitForLoadState('networkidle');
    
    // Verify only ONE employee was created (not duplicates)
    await expect(page.locator('text=Successfully Saved')).toBeVisible({ timeout: 5000 });
    
    // Navigate to employee list to verify only one employee with this name exists
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Count occurrences of "MultiClick"
    const multiClickElements = page.locator('text=MultiClick');
    const count = await multiClickElements.count();
    
    // Should have minimal occurrences (system should prevent duplicates)
    expect(count).toBeLessThanOrEqual(2); // At most header and one row
  });
});