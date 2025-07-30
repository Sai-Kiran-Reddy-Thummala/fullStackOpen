import { useState } from 'react'

const Blog = ({ blog,
  toggleLikes,
  handleDelete,
  username }) => {
  const [view, setView] = useState(false)

  console.log('blog user', blog.user)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isCreator = blog.user?.username === username

  return (
    <div className='blog' style={blogStyle}>
      {!view ? (
        <div className='blog-summary'>
          {blog.title} {blog.author} <button onClick={() => setView(true)}>View</button>
        </div>
      ) : (
        <div className='blog-details'>
          {blog.title} <button onClick={() => setView(false)}>Hide</button>
          <div>{blog.url}</div>
          <div>likes: {blog.likes} <button data-testid='like'
            onClick={toggleLikes}>Like</button></div>
          <div>{blog.author}</div>
          {isCreator && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog