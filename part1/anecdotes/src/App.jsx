
import { useState } from "react"

const Display = ({votes,anecdotes}) => {
  const max_value = Math.max(...votes)
  const index = votes.indexOf(max_value)

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      {anecdotes[index]} 
      <br></br>
      has {votes[index]} votes
      </div>
  )
}
const Votes = ({votes,selected}) => {
  return (
    <div>
    has {votes[selected]} votes
    </div>
  )
}

const Title = ({title}) => {
  return (
    <h1>
      {title}
    </h1>
  )
}


const Anecdotes = ({anecdote,selected}) => {
  return (
    <div>
      {anecdote[selected]}
    </div>
  )
}


const Button = (props) => {
  return (
    <button onClick = {props.onClick} >{props.text}</button> 
  )
}


const App = () => {
  const [selected, setSelected] = useState(0)
  const [votes,setVotes] = useState(Array(8).fill(0))
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  console.log(votes)

  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes) 
  }

  const handleState = () => {
    const min = 0
    const max = anecdotes.length
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    console.log(randomNumber)
    setSelected(randomNumber)
  }


  return (
    <div>
      <Title title="Anecdote of the day"></Title>
      <Anecdotes anecdote={anecdotes} selected ={selected}></Anecdotes>
      <Votes votes={votes} selected = {selected}></Votes>
      <Button onClick = {handleVote} text="vote"></Button>
      <Button onClick = {handleState} text="next anecdotes"></Button>
      <Display votes={votes} anecdotes={anecdotes}></Display>
    </div>
  ) 
}

export default App