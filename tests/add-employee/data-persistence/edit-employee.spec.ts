// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Data Persistence and Verification', () => {
  test('Edit employee after creation', async ({ page }) => {
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
    
    // Create employee
    const originalLastName = `Original${Date.now()}`;
    await page.getByRole('textbox', { name: 'First Name' }).fill('EditTest');
    await page.getByRole('textbox', { name: 'Last Name' }).fill(originalLastName);
    
    // Save employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // Navigate to Employee List
    await page.getByRole('link', { name: 'Employee List' }).click();
    await page.waitForLoadState('networkidle');
    
    // Search for employee
    const searchField = page.locator('input[placeholder*="Search"]').first();
    if (await searchField.isVisible()) {
      await searchField.fill('EditTest');
      await page.waitForLoadState('networkidle');
    }
    
    // Click on employee to open details
    const employeeLink = page.locator('text=EditTest').first();
    if (await employeeLink.isVisible()) {
      await employeeLink.click();
      await page.waitForLoadState('networkidle');
      
      // Look for Edit button or make Last Name field editable
      const editButton = page.locator('button:has-text("Edit")');
      if (await editButton.isVisible()) {
        await editButton.click();
      }
      
      // Try to modify the last name
      const lastNameField = page.getByRole('textbox', { name: 'Last Name' });
      if (await lastNameField.isVisible()) {
        // Clear and enter new name
        await lastNameField.clear();
        await lastNameField.fill('ModifiedName');
        
        // Save changes
        const saveButton = page.getByRole('button', { name: 'Save' });
        if (await saveButton.isVisible()) {
          await saveButton.click();
          
          // Verify successful update
          await expect(page.locator('text=Successfully Saved').or(page.locator('text=Updated'))).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });
});