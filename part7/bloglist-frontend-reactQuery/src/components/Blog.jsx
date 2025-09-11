import { useUserValue } from '../contexts/UserContext'
import CommentForm from './CommentForm'
import blogService from '../services/blogs'
import { useQuery } from '@tanstack/react-query'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, toggleLikes, handleDelete }) => {
 
  const user = useUserValue()
  const notificationDispatch = useNotificationDispatch()
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  const showNotification = (type, payload, timeout = 3000) => {
    notificationDispatch({ type, payload })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(
      () => notificationDispatch({ type: 'RESET' }),
      timeout
    )
  }

  useEffect(() => {
    if (!blog) {
      showNotification('ERROR', 'Blog not found')
      navigate('/')
    }
  }, [])

  const commentsQuery = useQuery({
    queryKey: ['comments', blog ? blog.id : 'no-blog'],
    queryFn: () =>
      blog ? blogService.getComment(blog.id) : Promise.resolve([]),
    onError: (error) => {
      console.error('Error fetching comments:', error.message)
    },
  })

  if (!blog) {
    return null
  }

  const username = user?.username
  const isCreator = blog.user?.username === username
  const comments = commentsQuery.data

  return (
    <>
      <div className="blog-card">
        <h2>{blog.title}</h2>
        <p>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </p>
        <p>
          {blog.likes} likes{' '}
          {user && <button onClick={toggleLikes}>like</button>}
        </p>
        <p>
          added by <strong>{blog.author}</strong>
        </p>
        {isCreator && <button onClick={handleDelete}>Delete</button>}
      </div>
      <div>
        <h2>comments</h2>
        {user && <CommentForm blog={blog} comments={comments} />}

        {commentsQuery.isLoading ? (
          <p>Loading comments...</p>
        ) : commentsQuery.isError ? (
          <p>
            Error:{' '}
            {commentsQuery.error.response?.data?.error ||
              'Something went wrong while fetching comments.'}
          </p>
        ) : comments && comments.length > 0 ? (
          <ul>
            {comments.map((c) => (
              <li key={c.id}>{c.comment.text}</li>
            ))}
          </ul>
        ) : (
          <strong>No comments are made</strong>
        )}
      </div>
    </>
  )
}

export default Blog
