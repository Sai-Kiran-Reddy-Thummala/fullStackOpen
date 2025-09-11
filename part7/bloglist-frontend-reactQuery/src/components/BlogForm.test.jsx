import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('the mock function recieves the correct input', async () => {
    const createBlogMock = vi.fn()

    const { container } = render(<BlogForm createBlog={createBlogMock} />)

    const title = container.querySelector('#title-input')
    expect(title).toBeInTheDocument()

    const author = container.querySelector('#author-input')
    expect(author).toBeInTheDocument()

    const url = container.querySelector('#url-input')
    expect(url).toBeInTheDocument()

    const createButton = screen.getByText('create')

    await userEvent.type(title, 'writing a new note')
    await userEvent.type(author, 'Azure dragon')
    await userEvent.type(url, 'http://azureDragon.com')

    await userEvent.click(createButton)

    expect(createBlogMock).toHaveBeenCalledTimes(1)
    expect(createBlogMock).toHaveBeenCalledWith(
      {
        title: 'writing a new note',
        author: 'Azure dragon',
        url: 'http://azureDragon.com'
      })
    expect(createBlogMock.mock.calls[0][0]).toEqual(
      {
        title: 'writing a new note',
        author: 'Azure dragon',
        url: 'http://azureDragon.com'
      }
    )
  })
})