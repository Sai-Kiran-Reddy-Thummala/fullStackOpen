import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = () => axios.get(baseUrl).then(response => response.data)

export const addAnecdote = newObject => axios.post(baseUrl, newObject).then(response => response.data)

export const updateAnecdoteVote = anecdote => axios.put(`${baseUrl}/${anecdote.id}`, anecdote).then(response => response.data)