import PropTypes from 'prop-types'
import { useSelector, useDispatch } from "react-redux"
import { addVote } from "../reducers/anecdoteReducer"
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({ anecdote, handleVote }) => {
    return (
        <>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleVote}>vote</button>
            </div>
        </>
    )
}

Anecdote.propTypes = {
    anecdote: PropTypes.shape({
        id: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        votes: PropTypes.number.isRequired
    }).isRequired,
    handleVote: PropTypes.func.isRequired
}

const AnecdoteList = () => {

    const anecdotes = useSelector(({ anecdotes, filter }) => {
        if (filter === '') {
            return [...anecdotes].sort((a, b) => b.votes - a.votes)
        }

        return [...anecdotes]
            .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => b.votes - a.votes)
    })
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(addVote(anecdote))
        dispatch(setNotification(`You voted '${anecdote.content}'`, 3000))
    }

    return (
        <div>
            {anecdotes.map(anecdote =>
                <Anecdote
                    key={anecdote.id}
                    anecdote={anecdote}
                    handleVote={() => vote(anecdote)}
                />
            )}
        </div>
    )
}

export default AnecdoteList