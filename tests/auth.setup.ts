import { test as setup } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authDir = path.join(__dirname, '.auth');
const authFile = path.join(authDir, 'user.json');

setup('authentication', async ({ page }) => {
  fs.mkdirSync(authDir, { recursive: true });

  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByText('Sign in').click();

  await page.getByRole('textbox', { name: 'Email' }).fill('rutushah105@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('Rutu@123');

  await Promise.all([
    page.waitForURL('**/'),
    page.getByRole('button', { name: 'Sign in' }).click()
  ]);

  await page.context().storageState({ path: authFile });
});