import {test, expect, request} from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach( async ({page}) =>{
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body:JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name:'Email'}).fill('rutushah105@gmail.com');
    await page.getByRole('textbox', {name:'Password'}).fill('Rutu@123');
    await page.getByRole('button', {name:'Sign in'}).click()
})

test('First test to validate the title of the page', async ({page})=> {

    await page.route('*/**/api/articles*', async route =>{
       const response = await route.fetch()
       const responseBody = await response.json()
       responseBody.articles[0].title = "This is a MOCK test title"
       responseBody.articles[0].description = "This is a MOCK test description"

       await route.fulfill({
        body:JSON.stringify(responseBody)   
        })
    })

    await page.getByText('Global Feed').click()

    
    // page.pause();
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    // page.pause()
    await expect(page.locator('app-article-preview h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-preview p').first()).toContainText('This is a MOCK test description')

})



test.only('Delete article test', async ({page, request}) => {
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
    // console.log(responseBody.user.token)

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
        data:{
            "article":{"title":"This is the test title","description":"This is the test article","body":"This is the test description","tagList":[]}
        },
        headers:{
            'Authorization':`Token ${accessToken}`
        }
    })

    await expect(articleResponse.status()).toEqual(201);
   
    const globalFeed = await page.getByText('Global Feed')

     globalFeed.click()
     await page.getByText('This is the test title').click()
     await page.getByRole('button', {name:'Delete Article'}).first().click()
    
    //  await expect(page.getByText('This is the test title')).toHaveCount(0)
    // or we can also do like this as mentioned below to validate that the article is deleted successfully and the title is not visible on the page
    await expect(page.locator('app-article-preview h1').first()).not.toContainText('This is the test title')
})


test('Delete the article using API and validate the same on UI', async ({page, request}) => {


})