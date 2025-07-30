const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'BlueHawk',
                name: 'Sai Kiran',
                password: 'root'
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await page.getByRole('button', { name: 'Login' }).click()

        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'BlueHawk', 'root')
            await expect(page.getByText('Sai Kiran logged-in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'BlueHawk', 'root1')
            await expect(page.getByText('Sai Kiran logged-in')).not.toBeVisible()
            await expect(page.getByTestId('notification')).toBeVisible()
            await expect(page.getByTestId('notification')).toContainText('Wrong credentials')
        })
    })

    describe('When logged in', () => {

        beforeEach(async ({ page }) => {
            await loginWith(page, 'BlueHawk', 'root')
            await expect(page.getByText('Sai Kiran logged-in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'a new blog created using playwright', 'Sai Kiran', 'http://localhost:3005.com')
            await expect(page.getByText('a new blog created using playwright Sai Kiran')).toBeVisible()
        })

        test('liking a blog', async ({ page }) => {
            await createBlog(page, 'a new blog created using playwright', 'Sai Kiran', 'http://localhost:3005.com')

            const blogDetailsDiv = await page.getByText('a new blog created using playwright Sai Kiran').locator('..')
            await blogDetailsDiv.getByRole('button', { name: 'View' }).click()

            await expect(page.locator('.blog-details')).toBeVisible()

            await expect(page.getByRole('button', { name: 'Like' })).toBeVisible()
            await page.getByRole('button', { name: 'Like' }).click()

            await expect(page.locator('.blog-details')).toContainText('likes: 1')
        })

        describe('removing blog', () => {

            test('removing a blog created by the user', async ({ page }) => {
                await createBlog(page, 'a new blog created using playwright', 'Sai Kiran', 'http://localhost:3005.com')

                const blogDetailsDiv = await page.getByText('a new blog created using playwright Sai Kiran').locator('..')
                await blogDetailsDiv.getByRole('button', { name: 'View' }).click()

                await expect(page.locator('.blog-details')).toBeVisible()

                await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

                page.once('dialog', async (dialog) => {
                    expect(dialog.type()).toBe('confirm')
                    expect(dialog.message()).toContain(`Remove blog 'a new blog created using playwright'?`)

                    await dialog.accept()
                })

                await page.getByRole('button', { name: 'remove' }).click()

                await expect(page.getByText('a new blog created using playwright Sai Kiran')).not.toBeVisible()
                await expect(page.getByTestId('notification')).toBeVisible()
            })

            test('Only creator can see the remove blog', async ({ page, request }) => {
                await createBlog(page, 'a new blog created using playwright', 'Sai Kiran', 'http://localhost:3005.com')
                await expect(page.getByText('a new blog created using playwright Sai Kiran')).toBeVisible()

                await page.getByRole('button', { name: 'logout' }).click()
                await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()

                await request.post('/api/users', {
                    data: {
                        username: 'SkyHawk',
                        name: 'Sai Kumar',
                        password: 'root'
                    }
                })

                await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
                await loginWith(page, 'SkyHawk', 'root')

                await createBlog(page, 'a new blog created by', 'Sai Kumar', 'http://example:3000.com')
                await expect(page.getByText('a new blog created by Sai Kumar')).toBeVisible()

                await expect(page.getByText('a new blog created using playwright Sai Kiran')).toBeVisible()
                const otherBlog = await page.getByText('a new blog created using playwright Sai Kiran').locator('..')
                await expect(otherBlog.getByRole('button', { name: 'View' })).toBeVisible()
                await otherBlog.getByRole('button', { name: 'View' }).click()

                const otherBlogDetailsDiv = await page.getByText('a new blog created using playwright').locator('..')
                await expect(otherBlogDetailsDiv).toBeVisible()
                await expect(otherBlogDetailsDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
            })
        })

        describe('blogs in order', () => {

            test('blogs are ordered by number of likes in descending order', async ({ page }) => {
                await createBlog(page, 'First blog', 'Author one', 'http://blog1.com')
                await expect(page.getByText('First blog Author one')).toBeVisible()

                await createBlog(page, 'Second blog', 'Author two', 'http://blog2.com')
                await expect(page.getByText('Second blog Author two')).toBeVisible()

                await createBlog(page, 'Third blog', 'Author three', 'http://blog3.com')
                await expect(page.getByText('Third blog Author three')).toBeVisible()

                await page.locator('.blog').filter({ hasText: 'First blog' }).getByRole('button', { name: 'View' }).click()
                await expect(page.locator('.blog').filter({ hasText: 'First blog' })).toBeVisible()

                await page.locator('.blog').filter({ hasText: 'Second blog' }).getByRole('button', { name: 'View' }).click()
                await expect(page.locator('.blog').filter({ hasText: 'Second blog' })).toBeVisible()

                await page.locator('.blog').filter({ hasText: 'Third blog' }).getByRole('button', { name: 'View' }).click()
                await expect(page.locator('.blog').filter({ hasText: 'Third blog' })).toBeVisible()

                const thirdBlogLike = await page.locator('.blog-details').filter({ hasText: 'Third blog' }).getByRole('button', { name: 'Like' })
                await thirdBlogLike.click()
                await page.waitForTimeout(200)
                await thirdBlogLike.click()
                await page.waitForTimeout(200)
                await thirdBlogLike.click()
                await page.waitForTimeout(200)

                const firstBlogLike = await page.locator('.blog-details').filter({ hasText: 'First blog' }).getByRole('button', { name: 'Like' })
                await firstBlogLike.click()
                await page.waitForTimeout(200)
                await firstBlogLike.click()
                await page.waitForTimeout(200)

                const blogs = await page.locator('.blog').all()

                const blogTexts = await Promise.all(blogs.map(blog => blog.textContent()))

                await expect(blogTexts[0]).toContain('Third blog')
                await expect(blogTexts[1]).toContain('First blog')
                await expect(blogTexts[2]).toContain('Second blog')
            })
        })
    })
})