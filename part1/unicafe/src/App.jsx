
import {useState} from 'react'


const StatisticLine = (props) => {
  return (
      <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
      </tr>
  )

}
const Statistic = ({good,neutral,bad}) => {
    const sum = good + neutral + bad

    if(sum === 0){
      return (
        <h3>No feedback given</h3>
      )
    }
    return (
      <>
      <table>
        <tbody>
      <StatisticLine text="good" value={good}></StatisticLine>
      <StatisticLine text="neutral" value={neutral}></StatisticLine>
      <StatisticLine text="bad" value = {bad}></StatisticLine>
      <StatisticLine text = "all" value={sum}></StatisticLine>
      <StatisticLine text = "average" value = {(good * 1 + neutral * 0 + bad * -1)/3}></StatisticLine>
      <StatisticLine text = "positive" value = {`${parseFloat(good/sum)} %`}></StatisticLine>
      </tbody>
      </table>
      </>
    )
  }
const Button = ({handleClick, text}) => {
  return (
    <button onClick = {handleClick} >{text} </button>
  )
}

const App = () => {

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <h1><b>Give feedback</b></h1>
      <Button handleClick={handleGood} text="good"></Button>
      <Button handleClick={handleNeutral} text="neutral"></Button>
      <Button handleClick={handleBad} text="bad"></Button>
      <h2><b>Statistic</b></h2>
      <Statistic good = {good} neutral = {neutral} bad = {bad}></Statistic>
      </div>
  )
}

export default App