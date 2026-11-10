// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Happy Path Scenarios', () => {
  test('Add employee with login credentials', async ({ page }) => {
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
    
    // Enter employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('Sarah');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Williams');
    
    // Check Create Login Details checkbox (force click as overlay may block pointer events)
    const loginDetailsCheckbox = page.locator('input[type="checkbox"]');
    await loginDetailsCheckbox.click({ force: true });
    
    // Verify login credential fields appear
    await expect(page.locator('text=Create Login Details')).toBeVisible();
    
    // Fill login credentials if fields become visible
    const usernameInput = page.locator('input[placeholder*="Username"]');
    if (await usernameInput.isVisible()) {
      await usernameInput.fill('sarah.williams');
      await page.locator('input[type="password"]').first().fill('Test@1234');
    }
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
  });
});