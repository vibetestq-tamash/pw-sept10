import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://qtpsudhakar-vibetestq-hrm.up.railway.app/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('testadmin');
  await page.getByRole('textbox', { name: 'Password' }).fill('Vibetestq@123#');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  // await page.pause();
  await page.getByRole('link', { name: 'Add Employee' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('test');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('user');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('banner').getByRole('img', { name: 'profile picture' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
});