const loginWith = async (page, username, password) => {
    await page.getByRole('button', { name: 'Login' }).click()

    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)

    await page.getByRole('button', { name: 'Log-in' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'Create' }).click()

    await page.getByTestId('title-input').fill(title)
    await page.getByTestId('author-input').fill(author)
    await page.getByTestId('url-input').fill(url)

    await page.getByRole('button', { name: 'save' }).click()
}

export { loginWith, createBlog }