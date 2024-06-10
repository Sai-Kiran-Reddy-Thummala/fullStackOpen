
import Input from "./components/Input"
import { useState, useEffect} from "react"
import axios from "axios"
import Filter from "./components/Filter"

const App = () => {

  const [name,setName] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
             .then(response => {
              setCountries(response.data)
             }
            ).catch(error => {
              console.log(error)
            })
    },[])


  const handleChange = e => { console.log(e.target.value)
                              setName(e.target.value) 
                            }

  return (
    <div>
      find countries <Input input={name} handleChange= {handleChange}></Input>
      <Filter countries={countries} countryName={name}></Filter>
    </div>
  )
}

export default App