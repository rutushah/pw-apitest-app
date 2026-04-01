import { test as setup, expect } from '@playwright/test';
import path from 'path';
import user from './.auth/user.json'
import fs from 'fs'

const authFile = path.join(__dirname, '../playwright/.auth/user.json');


setup('authentication', async ({ request }) => {

  /**UI authentication code commented temporarily and trying authentication using API */

  // await page.goto('https://conduit.bondaracademy.com/');
  // await page.getByText('Sign in').click();

  // await page.getByRole('textbox', { name: 'Email' }).fill('rutushah105@gmail.com');
  // await page.getByRole('textbox', { name: 'Password' }).fill('Rutu@123');

  // await Promise.all([
  //   page.waitForURL('**/'),
  //   page.getByRole('button', { name: 'Sign in' }).click()
  // ]);

  // await page.context().storageState({ path: authFile });



  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
    data:{
        "user":{
            "email":"rutushah105@gmail.com",
            "password":"Rutu@123"
        }
    }
}) 

const responseBody = await response.json()

const accessToken = responseBody.user.token
user.origins[0].localStorage[0].value = accessToken
fs.writeFileSync(authFile, JSON.stringify(user))

process.env['ACCESS_TOKEN'] = accessToken
});