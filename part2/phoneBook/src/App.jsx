import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {

    console.log("inside effect")

    personServices
    .getAll()
    .then(initialData => {
      console.log(initialData)
      setPersons(initialData);
    }) 
  },[])

  console.log('rendering', persons.length, 'values')
  
  const handleFilter = event => setFilter(event.target.value)

  const personsToShow = filter.trim() === '' ?
  persons :
  persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleNewNumber = (event) => {
    setNewNumber(event.target.value);
  }

  const handlePerson = (event) => {

    event.preventDefault();

    if( newName.trim() === '' || newNumber.trim() === ''){
      window.alert('Both name and number are required')
      return;
    }
    
    const existingPerson = persons.find( p => p.name.trim() === newName.trim())
    
    if(existingPerson){
      if(window.confirm(`${newName} is already added to the phonebook, replace the old one with a new one?`)){
        
        const updatedPerson = {
          ...existingPerson,
          number: newNumber
        }

        personServices
        .update(existingPerson.id,updatedPerson)
        .then(updatedPerson => {
          setPersons(persons.map(person => person.id !== existingPerson.id ? person : updatedPerson))
          setMessage(`${updatedPerson.name}'s number has been updated`)
          setTimeout(() => {
            setMessage(null)
          },5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error =>  {
          console.log(error)
          setMessage(`The person '${existingPerson.name}' was already removed from server.`)
          setTimeout(() => {
            setMessage(null)
          },5000)
           setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
      }
    }else{
    
    const newPerson = {
      name : newName,
      number: newNumber,
      }

    personServices
    .create(newPerson)
    .then(returnedPerson => {
      //setPersons(persons.concat(returnedPerson))
      setPersons(persons.concat(returnedPerson))
      setMessage(`${newName} has been added to phonebook`)
      setTimeout(() => {
          setMessage(null)
        }, 5000)
      setNewName('')
      setNewNumber('')
    })
    .catch(error => {
    console.log(error)
    setMessage(`Failed to add ${newName}: ${error.message}`)
    setTimeout(() => {
          setMessage(null)
        }, 5000)
  })
    }
  }

  const handleNewName = (event) =>  setNewName(event.target.value)
  
  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    
    if (!person) {
    alert('Person not found');
    return;
  }
    const personName = person.name

    if(window.confirm(`Delete ${personName} ?`)){
      personServices
      .remove(id)
      .then(message => {
        console.log(message)
        setMessage(`${personName} with id: ${id} has been deleted`)
        setTimeout(() => {
          setMessage(null)
        },5000)
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        console.log(error)
        setMessage(`Information of ${personName} has already been removed from server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        setPersons(persons.filter(p => p.id !== id));
          })
    }
      
  }
  return (
    <div>
      <h1>Phonebook</h1>
      <Filter value={filter} onChange={handleFilter}></Filter>
      <div>
        <Notification message={message}></Notification>
      </div>
      <h1>Add a new number</h1>
      <PersonForm onSubmit={handlePerson}
                  newName={newName}
                  handleNewName={handleNewName}
                  newNumber={newNumber}
                  handleNewNumber={handleNewNumber}>
                  </PersonForm>
      <h1>Numbers</h1>
      <Persons persons={personsToShow} handleDelete={handleDelete}></Persons>
    </div>
  )
}

export default App