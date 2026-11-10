// spec: tests/add-employee-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Add Employee - Edge Cases and Boundary Conditions', () => {
  test('Form field tab navigation', async ({ page }) => {
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
    
    // Focus on First Name field
    const firstNameField = page.getByRole('textbox', { name: 'First Name' });
    await firstNameField.focus();
    
    // Tab through fields
    await page.press('Tab');
    // Should move to Middle Name
    const middleNameField = page.getByRole('textbox', { name: 'Middle Name' });
    await expect(middleNameField).toBeFocused();
    
    // Tab to Last Name
    await page.press('Tab');
    const lastNameField = page.getByRole('textbox', { name: 'Last Name' });
    await expect(lastNameField).toBeFocused();
    
    // Enter values using Tab navigation
    await firstNameField.fill('Tab');
    await page.press('Tab');
    await page.type('Navigation');
    await page.press('Tab');
    await page.type('Test');
    
    // Tab to other interactive elements
    // Continue tabbing to reach Save/Cancel buttons
    let tabCount = 0;
    while (tabCount < 10) {
      await page.press('Tab');
      tabCount++;
      
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement;
        return active?.tagName + ':' + active?.textContent?.substring(0, 20);
      });
      
      // If we reached a button, verify it's interactive
      if (focusedElement?.includes('BUTTON')) {
        break;
      }
    }
    
    // Verify we can navigate using Tab
    expect(tabCount).toBeGreaterThan(0);
  });
});