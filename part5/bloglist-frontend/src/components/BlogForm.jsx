import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleCreate = async (event) => {
    event.preventDefault()
    await createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <>
      <h2>Create Blog</h2>
      <form onSubmit={handleCreate}>
        <div>
          Title <input
            data-testid='title-input'
            value={title}
            name='title'
            onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          Author <input
            data-testid='author-input'
            value={author}
            name='author'
            onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          Url <input
            data-testid='url-input'
            value={url}
            name='url'
            onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">save</button>
      </form>
    </>
  )
}

export default BlogForm