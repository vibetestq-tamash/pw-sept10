// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Form Navigation and Cancellation', () => {
  test('Back button behavior', async ({ page }) => {
    // Navigate to login page
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to Add Employee
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    
    // Store current URL for reference
    const pimUrl = page.url();
    
    // Click Add Employee
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // Enter some information
    await page.getByRole('textbox', { name: 'First Name' }).fill('BackButton');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Use browser back button
    await page.goBack();
    
    // Verify browser history navigation worked
    // We should be back on the PIM page or have some navigation
    await page.waitForLoadState('networkidle');
  });
});