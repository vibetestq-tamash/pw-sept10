// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Happy Path Scenarios', () => {
  test('Employee ID is auto-generated correctly', async ({ page }) => {
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
    
    // Capture the auto-generated Employee ID (5th input: after First/Middle/Last Name and File input)
    const employeeIdField = page.locator('input').nth(5);
    let firstEmployeeId = '';
    firstEmployeeId = await employeeIdField.inputValue() || '';
    expect(firstEmployeeId).toMatch(/^\d+$/);
    
    // Enter employee details
    await page.getByRole('textbox', { name: 'First Name' }).fill('Robert');
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Johnson');
    
    // Save first employee
    await page.getByRole('button', { name: 'Save' }).click();
    
    // Verify success
    await expect(page.locator('text=Successfully Saved')).toBeVisible();
    
    // Navigate to Add another Employee
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await page.waitForLoadState('networkidle');
    
    // Verify new Employee ID is incremented
    const secondEmployeeIdField = page.locator('input').nth(5);
    const secondEmployeeId = await secondEmployeeIdField.inputValue() || '';
    
    expect(secondEmployeeId).not.toBe(firstEmployeeId);
    expect(parseInt(secondEmployeeId)).toBeGreaterThan(parseInt(firstEmployeeId));
  });
});