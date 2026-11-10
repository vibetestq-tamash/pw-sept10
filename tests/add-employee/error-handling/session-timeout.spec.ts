// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Error Handling and Recovery', () => {
  test('Session timeout during form interaction', async ({ page, context }) => {
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
    await page.getByRole('textbox', { name: 'First Name' }).fill('SessionTimeout');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Test');
    
    // Simulate session timeout by clearing cookies
    const cookies = await context.cookies();
    for (const cookie of cookies) {
      if (cookie.name.toLowerCase().includes('session') || 
          cookie.name.toLowerCase().includes('auth') ||
          cookie.name.toLowerCase().includes('cookie')) {
        await context.clearCookies({ name: cookie.name });
      }
    }
    
    // Try to save
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Wait for response
    await page.waitForLoadState('networkidle');
    
    // System should either:
    // 1. Redirect to login page
    // 2. Show session expired message
    // 3. Show error message
    
    const loginPageIndicators = [
      page.locator('text=Login'),
      page.locator('text=Session Expired'),
      page.locator('text=Please Login'),
      page.locator('text=Username')
    ];
    
    let foundIndicator = false;
    for (const indicator of loginPageIndicators) {
      if (await indicator.isVisible({ timeout: 5000 }).catch(() => false)) {
        foundIndicator = true;
        break;
      }
    }
    
    // Verify session timeout was handled
    expect(foundIndicator || page.url().includes('login')).toBeTruthy();
    
    // Re-login
    if (await page.locator('text=Username').isVisible()) {
      await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
      await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
      await page.getByRole('button', { name: 'Login' }).click();
      await page.waitForLoadState('networkidle');
      
      // Verify login successful
      await expect(page.locator('text=Dashboard').or(page.locator('heading'))).toBeVisible({ timeout: 5000 });
    }
  });
});