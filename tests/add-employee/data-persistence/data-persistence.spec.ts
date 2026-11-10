// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Data Persistence and Verification', () => {
  test('Verify employee data is persisted in database', async ({ page }) => {
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
    
    // Create unique employee
    const uniqueName = `DBTest${Date.now()}`;
    await page.getByRole('textbox', { name: 'First Name' }).fill('Database');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(uniqueName);
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // Logout
    const profileMenu = page.locator('img[alt="profile picture"]').first();
    await profileMenu.click();
    
    // Wait for menu to appear
    await page.waitForTimeout(500);
    
    // Click Logout if available
    const logoutButton = page.locator('text=Logout').or(page.locator('text=Sign Out'));
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }
    
    // Login again
    await page.waitForLoadState('networkidle');
    await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
    await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Navigate to Employee List
    await page.getByRole('link', { name: 'PIM' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Search for employee
    const searchField = page.locator('input[placeholder*="Search"]').first();
    if (await searchField.isVisible()) {
      await searchField.fill(uniqueName);
      await page.waitForLoadState('networkidle');
    }
    
    // Verify employee still exists
    await expect(page.locator('text=Database')).toBeVisible({ timeout: 5000 });
  });
});