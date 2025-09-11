import { useState } from 'react'
import { useField } from './hooks/index'

import { Link, Routes, Route, useMatch, useNavigate, Navigate } from 'react-router-dom'

const padding = {
  paddingRight: 5
}

const Menu = () => {
  return (
    <div>
      <Link style={padding} to='/'>anecdotes</Link>
      <Link style={padding} to='/create'>create</Link>
      <Link style={padding} to='/about'>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id} ><Link style={padding} to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {

  if (!anecdote) return <h2>Anecdote not found</h2>

  return (
    <div>
      <h2>Anecdote</h2>
      <p>{anecdote.content} has {anecdote.votes} votes</p>
      <p>
        for more info see: <a href={anecdote.info} target='_blank' rel='noreferrer'>{anecdote.info}</a>
      </p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is &quot;a story with a point.&quot;</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = ({ addNew, handleNotification }) => {

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  //used Rest operator to get the reset and copied the remaining properties into another variable
  const { reset: contentReset, ...contentInputProps } = content
  const { reset: authorReset, ...authorInputProps } = author
  const { reset: infoReset, ...infoInputProps } = info

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const anecdote = {
      content,
      author,
      info,
      votes: 0
    }
    addNew(anecdote)
    handleNotification(`a new anecdote ${anecdote.content} created!`)
    navigate('/')
    setTimeout(() => handleNotification(''), 5000)
  }

  const handleReset = () => {
    contentReset()
    authorReset()
    infoReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content:
          <input name='content' {...contentInputProps} />
        </div>
        <div>
          author:
          <input name='author' {...authorInputProps} />
        </div>
        <div>
          url for more info:
          <input name='info' {...infoInputProps} />
        </div>
        <button type='submit'>create</button> <button type='reset' onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const Notification = ({ notification }) => {
  const boxStyle = {
    padding: '5px',
    border: '1px solid black',
    marginTop: '15px'
  }

  if (!notification) return null

  return (
    <div style={boxStyle}>
      {notification}
    </div>
  )
}
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const handleNotification = (text) => {
    setNotification(text)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useMatch('/anecdotes/:id')
  const anecdote = match
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification} />
      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route path='/anecdotes' element={<Navigate to='/' />} />
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} />} />
        <Route path='/create' element={<CreateNew addNew={addNew} handleNotification={handleNotification} />} />
        <Route path='/about' element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
