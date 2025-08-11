import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAnecdote } from "../requests"
import { useNotificationDispatch } from "../contexts/useNotification"

const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const notificationDispatch = useNotificationDispatch()

  const anecdoteAddQuery = useMutation({
    mutationFn: addAnecdote,
    onSuccess: (newObject) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newObject))
      notificationDispatch({ type: 'ADD', payload: newObject.content })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({ type: 'ERROR', payload: error.response.data.error })
      setTimeout(() => {
        notificationDispatch({ type: 'RESET' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    anecdoteAddQuery.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
