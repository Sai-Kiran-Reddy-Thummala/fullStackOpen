import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAll, updateAnecdoteVote } from './requests'
import { useNotificationDispatch } from './contexts/useNotification'


const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const anecdoteVote = useMutation({
    mutationFn: updateAnecdoteVote,
    onSuccess: (newObject) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === newObject.id ? newObject : a))
      notificationDispatch({ type: 'VOTE', payload: newObject.content })
    }
  })

  const handleVote = (anecdote) => {
    anecdoteVote.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const anecdoteQuery = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    refetchOnWindowFocus: false
  })

  console.log(JSON.parse(JSON.stringify(anecdoteQuery)))

  if (anecdoteQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (anecdoteQuery.isError) {
    return <div>Error: Anecdote service is not available due to problems at server</div>
  }

  const anecdotes = anecdoteQuery.data.sort((a, b) => b.votes - a.votes)

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
