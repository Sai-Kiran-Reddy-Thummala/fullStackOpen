import {useState, useEffect} from 'react'
import service from './services/requests'
import CountriesList from './components/CountriesList'

const App = () => {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])

  const handleShow = country => setValue(country.name.common)

  useEffect(() => {
    service
    .getAll()
    .then(countriesList => {
      setCountries(countriesList)
    })
    .catch( error => {
      console.log(error)
    })
  }, [])

  const handleValue = (event) => {
    setValue(event.target.value)
  }

  return (
    <div>
      <label>Find countries</label>
      <input value={value} onChange={handleValue}></input>
      <CountriesList countries={countries} value={value} handleShow={handleShow}></CountriesList>
    </div>
  )
}

export default App