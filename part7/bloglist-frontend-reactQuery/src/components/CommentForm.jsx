import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import blogServices from '../services/blogs'
import { useNotificationDispatch } from '../contexts/NotificationContext'

const CommentForm = ({ blog }) => {
  const [comment, setComment] = useState('')
  const notificationDispatch = useNotificationDispatch()
  const timeoutRef = useRef(null)
  const queryClient = useQueryClient()

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

  const commentMutation = useMutation({
    mutationFn: blogServices.postComment,
    onSuccess: (savedComment) => {
      showNotification('ADD', 'Your comment has been saved!!')

      queryClient.setQueryData(['comments', blog.id], (old = []) => [
        ...old,
        savedComment,
      ])

      setComment('')
    },
    onError: (error) => {
      showNotification('ERROR', error.message)
    },
  })

  const handleComment = (event) => {
    event.preventDefault()
    if (comment.trim() === '') return

    // Corrected key: id instead of idd
    commentMutation.mutate({ id: blog.id, text: comment })
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <form onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Write a comment here"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
        <button type="submit">Add comment</button>
      </form>
    </div>
  )
}

export default CommentForm
