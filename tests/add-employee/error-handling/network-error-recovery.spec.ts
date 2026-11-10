// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Error Handling and Recovery', () => {
  test('Recover from network error during save', async ({ page, context }) => {
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
    
    // Fill employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('NetworkError');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Simulate network offline
    await context.setOffline(true);
    
    // Try to save (should fail due to network)
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Wait a moment for error
    await page.waitForTimeout(1000);
    
    // Form data should still be present
    const firstNameField = page.getByRole('textbox', { name: 'First Name' });
    const currentValue = await firstNameField.inputValue();
    expect(currentValue).toBe('NetworkError');
    
    // Restore network connectivity
    await context.setOffline(false);
    
    // Retry save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Wait for response with network connectivity restored
    await page.waitForLoadState('networkidle');
    
    // Verify success after network recovery
    await expect(page.locator('text=Successfully Saved')).toBeVisible({ timeout: 5000 });
  });
});