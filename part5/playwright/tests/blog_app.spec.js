const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')
const { log } = require('console')
const { default: login } = require('../../bloglist-frontend/src/services/login')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                username: 'Bluehawk',
                name: 'Sai Kiran',
                password: 'root'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const loginButton = await page.getByRole('button', { name: 'Login' })
        await expect(loginButton).toBeVisible()

        await loginButton.click()

        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'Log-in' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'Bluehawk', 'root')
            await expect(page.getByText('Sai Kiran logged-in')).toBeVisible()
        })
        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'Bluehawk', 'root1')
            await expect(page.getByText('Sai Kiran logged-in')).not.toBeVisible()
            await expect(page.getByTestId('notification')).toBeVisible()
            await expect(page.getByTestId('notification')).toContainText('Wrong credentials')
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'Bluehawk', 'root')
            await expect(page.getByText('Sai Kiran logged-in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
            await createBlog(page, 'A blog created by', 'Sai Kiran', 'http://saikiranblog.com')
            await expect(page.locator('.blog')).toContainText('A blog created by Sai Kiran')
        })

        test('A blog can be liked', async ({ page }) => {
            await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
            await createBlog(page, 'A blog created by', 'Sai Kiran', 'http://saikiranblog.com')

            const viewButton = await page.locator('.blog-summary').getByRole('button', { name: 'View' })
            await expect(viewButton).toBeVisible()
            await viewButton.click()

            await expect(page.locator('.blog-details')).toBeVisible()
            const likeButton = await page.getByTestId('like')
            await expect(likeButton).toBeVisible()
            await likeButton.click()

            await expect(page.locator('.blog')).toContainText('likes: 1')
        })

        describe('Deleting a blog', () => {
            beforeEach(async ({ page }) => {
                await expect(page.getByRole('button', { name: 'Create' })).toBeVisible()
                await createBlog(page, 'A blog created by', 'Sai Kiran', 'http://saikiranblog.com')
                await expect(page.locator('.blog')).toContainText('A blog created by Sai Kiran')
            })

            test('Only created user can delete the blog', async ({ page }) => {
                const viewButton = await page.locator('.blog-summary').getByRole('button', { name: 'View' })
                await expect(viewButton).toBeVisible()
                await viewButton.click()

                await expect(page.locator('.blog-details')).toBeVisible()
                const removeButton = await page.locator('.blog').getByRole('button', { name: 'remove' })
                await expect(removeButton).toBeVisible()

                page.once('dialog', async dialog => {
                    await expect(dialog.type()).toBe('confirm')
                    await expect(dialog.message()).toBe(`Remove blog 'A blog created by'?`)

                    await dialog.accept()
                })

                await removeButton.click()
                await expect(page.locator('.blog')).not.toBeVisible()

            })

            test('Only blog created user can see the remove button', async ({ page }) => {
                const viewButton = await page.locator('.blog-summary').getByRole('button', { name: 'View' })
                await expect(viewButton).toBeVisible()
                await viewButton.click()

                await expect(page.locator('.blog-details')).toBeVisible()
                const removeButton = await page.locator('.blog').getByRole('button', { name: 'remove' })
                await expect(removeButton).toBeVisible()
            })

            test('user cannot see remove button for blog created by another user', async ({ page, request }) => {
                const logoutButton = await page.getByTestId('logout')
                await expect(logoutButton).toBeVisible()
                await logoutButton.click()

                await request.post('/api/users', {
                    data: {
                        username: 'Blackhawk',
                        name: 'Bachi',
                        password: 'root'
                    }
                })

                await loginWith(page, 'Blackhawk', 'root')
                await expect(page.getByText('Bachi logged-in')).toBeVisible()

                const viewButton = await page.locator('.blog-summary').getByRole('button', { name: 'View' })
                await expect(viewButton).toBeVisible()
                await viewButton.click()

                await expect(page.locator('.blog-details')).toBeVisible()
                const removeButton = await page.locator('.blog').getByRole('button', { name: 'remove' })
                await expect(removeButton).not.toBeVisible()
            })
        })

        test('blogs are in descending order according to the number of likes', async ({ page }) => {
            await createBlog(page, 'First blog', 'Author one', 'http://firstblog.com')
            await createBlog(page, 'Second blog', 'Author two', 'http://secondblog.com')
            await createBlog(page, 'Third blog', 'Author three', 'http://threeblog.com')

            const blogOneViewButton = await page.locator('.blog', { hasText: 'First blog Author one' }).getByRole('button', { name: 'View' })
            await blogOneViewButton.click()
            const blogOneLikeButton = await page.locator('.blog').locator('.blog-details', { hasText: 'First blog' }).getByRole('button', { name: 'Like' })
            await expect(blogOneLikeButton).toBeVisible()

            const blogTwoViewButton = await page.locator('.blog', { hasText: 'Second blog Author two' }).getByRole('button', { name: 'View' })
            await blogTwoViewButton.click()
            const blogTwoLikeButton = await page.locator('.blog').locator('.blog-details', { hasText: 'Second blog' }).getByRole('button', { name: 'Like' })
            await expect(blogTwoLikeButton).toBeVisible()

            const blogThreeViewButton = await page.locator('.blog', { hasText: 'Third blog Author three' }).getByRole('button', { name: 'View' })
            await blogThreeViewButton.click()
            const blogThreeLikeButton = await page.locator('.blog').locator('.blog-details', { hasText: 'Third blog' }).getByRole('button', { name: 'Like' })
            await expect(blogThreeLikeButton).toBeVisible()

            await blogThreeLikeButton.click()
            await page.waitForTimeout(300)
            await blogThreeLikeButton.click()
            await page.waitForTimeout(300)

            await blogOneLikeButton.click()
            await page.waitForTimeout(300)

            const blogs = await page.locator('.blog').all()
            const orderedBlogs = await Promise.all(blogs.map(async blog => await blog.textContent()))

            await expect(orderedBlogs[0]).toContain('Third blog')
            await expect(orderedBlogs[1]).toContain('First blog')
            await expect(orderedBlogs[2]).toContain('Second blog')
        })
    })
})