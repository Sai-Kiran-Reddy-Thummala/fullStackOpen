import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const BlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog = async (event) => {
    event.preventDefault()
    await handleCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create Blog</h2>
      <Form onSubmit={createBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
            data-testid="title-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
            data-testid="author-input"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
            data-testid="url-input"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  )
}

export default BlogForm
