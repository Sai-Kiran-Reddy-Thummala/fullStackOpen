import { useEffect, useState } from "react"
import Filter from "./components/Filter"
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import personService from "./services/person"
import Notification from "./components/Notification"

const App = () => {

  const [persons,setPersons] = useState([])
  const [newName,setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const [filters, setFilter] = useState('')
  const [message,setMessage] = useState('')

  useEffect(() => {
    console.log("in effect")
    personService.getAll()
                .then(initialResponse => {
                  console.log(initialResponse)
                  return setPersons(initialResponse)
                })
  },[])
  
  const handleNewName = e => { setNewName(e.target.value) }

  const handleNewNumber = e => { setNewNumber(e.target.value) }

  const handleFilter = e => { setFilter(e.target.value) }

  const handleAdd = e => {
    e.preventDefault()
    const existingPerson = persons.find(p => p.name === newName)
   if(existingPerson){
      if(window.confirm(`${newName} is already in the phonebook, replace the old number with a new one?`)){
        const newPerson = {...existingPerson,number : newNumber}
        const updatedPerson = { ...existingPerson, number: newNumber };
    personService.update(existingPerson.id, updatedPerson)
                 .then((response) => {
                 setPersons(
                 persons.map((person) =>
          person.id !== existingPerson.id ? person : response
        )
      )
      setNewName("");
      setNewNumber("");
    }).catch(error => {
          setMessage(`Information of ${newName} is already been deleted from the server.`)
          setTimeout(() => {
              setMessage('')
          }, 5000)
          setPersons(persons.filter(person => person.name !== newName))
        }
    );
} 
    }else {
      const newPerson = {name: newName,number: newNumber}
      personService.create(newPerson)
                  .then(response => {
                    setMessage(`'${response.name}' is added to phonebook`)
                    setTimeout(()=> {setMessage('')},5000)
                    setPersons(persons.concat(response))
                    setNewName('')
                    setNewNumber('')
                  }).catch( error => {
                      setMessage(`name or number is missing.`)
                  })
    }
  }

  const handleRemove = (id,name) => {
      if(window.confirm(`Delete ${name}?`)){
          personService.remove(id)
                       .then(response => {
                        console.log(response)
                        setPersons(persons.filter(p => p.id !== id))
                       })
      }
  }
                  
/*
  const escapeRegExp = (exp) => { return exp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

  const regEx = new RegExp(escapeRegExp(filters),'i')
  console.log("regEx",regEx)
  const personsToShow = filters !== '' 
  ?  persons.filter(item => regEx.test(item.name)) 
   : persons
*/
  
   const personsToShow =  persons.map(props => props.name.toLowerCase().includes(filters.toLowerCase())) ?
   persons.filter(props => props.name.toLowerCase().includes(filters.toLowerCase())) :
   persons;

     return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message}></Notification>
      <h3>Filter</h3>

      <Filter filter= {filters} 
              handleFilter={handleFilter}>  
              </Filter>

      <h3>Add new</h3>

      <PersonForm onSubmit={handleAdd} 
                  newName={newName} 
                  newNumber={newNumber} 
                  handleNewNumber={handleNewNumber} 
                  handleNewName={handleNewName} 
                 > 
                  </PersonForm>

      <h2>Numbers</h2>
      { personsToShow.map(person => <Persons person={person} key={person.id} onClick={() => handleRemove(person.id,person.name)}></Persons>) }
    </div>
  )
  }

export default App