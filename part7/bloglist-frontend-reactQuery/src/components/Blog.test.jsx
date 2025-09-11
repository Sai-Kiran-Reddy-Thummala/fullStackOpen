import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders title and author but not url or likes by default', () => {
    const blog = {
      title: 'This gets rendered on the page',
      author: 'Sai Kiran',
      url: 'http://example.com',
      likes: 79
    }

    const { container } = render(<Blog blog={blog} />)

    expect(screen.getByText('This gets rendered on the page Sai Kiran')).toBeInTheDocument()
    expect(screen.queryByText('http://example.com')).not.toBeInTheDocument()
    expect(screen.queryByText('likes: 79')).not.toBeInTheDocument()

    expect(container.querySelector('.blog-summary')).toBeInTheDocument()
    expect(container.querySelector('.blog-details')).not.toBeInTheDocument()
  })

  test('Clicking the "View" button displays the URL and likes', async () => {
    const blog = {
      title: 'This gets rendered on the page',
      author: 'Sai Kiran',
      url: 'http://example.com',
      likes: 79
    }

    const { container } = render(<Blog blog={blog} />)
    const button = screen.getByText('View')

    await userEvent.click(button)

    expect(container.querySelector('.blog-summary')).not.toBeInTheDocument()
    expect(container.querySelector('.blog-details')).toBeInTheDocument()
    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText('likes: 79')).toBeInTheDocument()

  })

  test('ensures that if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
    const blog = {
      title: 'This gets rendered on the page',
      author: 'Sai Kiran',
      url: 'http://example.com',
      likes: 79
    }

    const toggleLikeMock = vi.fn() // mock function
    const { container } = render(<Blog blog={blog} toggleLikes={toggleLikeMock}/>)

    const viewButton = screen.getByText('View')

    await userEvent.click(viewButton)

    expect(container.querySelector('.blog-summary')).not.toBeInTheDocument()
    expect(container.querySelector('.blog-details')).toBeInTheDocument()

    const likeButton = screen.getByText('Like')

    await userEvent.click(likeButton)
    await userEvent.click(likeButton)

    expect(toggleLikeMock.mock.calls).toHaveLength(2)
  })
})