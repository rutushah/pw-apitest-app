import {test, expect, request} from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach( async ({page}) =>{
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body:JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/');
   
})

// test('First test to validate the title of the page', async ({page})=> {

//     await page.route('*/**/api/articles*', async route =>{
//        const response = await route.fetch()
//        const responseBody = await response.json()
//        responseBody.articles[0].title = "This is a MOCK test title"
//        responseBody.articles[0].description = "This is a MOCK test description"

//        await route.fulfill({
//         body:JSON.stringify(responseBody)   
//         })
//     })

//     await page.getByText('Global Feed').click()

    
//     // page.pause();
//     await expect(page.locator('.navbar-brand')).toHaveText('conduit');
//     // page.pause()
//     // await expect(page.locator('app-article-preview h1').first()).toContainText('This is a MOCK test title')
//     // await expect(page.locator('app-article-preview p').first()).toContainText('This is a MOCK test description')

// })



test('Delete article test', async ({page, request}) => {
    // console.log(responseBody.user.token)

    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
        data:{
            "article":{"title":"This is the test title","description":"This is the test article","body":"This is the test description","tagList":[]}
        },
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


test('Create Article', async ({page, request}) => {
    await page.getByText('New Article').click();
    await page.getByRole('textbox', {name:'Article Title'}).fill('Playwright API Test Article');
    await page.getByRole('textbox', {name:'What\'s this article about?'}).fill('This is the description of the article');
    await page.getByRole('textbox', {name:'Write your article (in markdown)'}).fill('This is the body of the article');
    await page.getByRole('button', {name:'Publish Article'}).click();
    const articlePublishResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articlePublishResponse.json()
    const slugId = articleResponseBody.article.slug

    await expect(page.locator('.banner h1')).toContainText('Playwright API Test Article')

    await page.getByText('Home').click()
    await expect(page.locator('app-article-preview h1').first()).toContainText('Playwright API Test Article')


    const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`,{})

    await expect(deleteArticleResponse.status()).toEqual(204);
    

})