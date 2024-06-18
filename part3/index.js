const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (request,response) => {
    return JSON.stringify(request.body)
})

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]




app.get('/',(request,response) => {
    response.send('<h1>Welcome!!</h1>')
})

app.get('/info',(request,response) => {
    console.log("in info")
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people <br /> ${date}<p>`)
})

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
        const id = Number(request.params.id)
        const person = persons.find( person => person.id === id)
    
        if(!person) {
            return response.status(400).end()
        }
        response.json(person)
})

app.delete('/api/persons/:id', (request,response) => {
     const id = Number(request.params.id)
     persons = persons.filter(person => person.id !== id)
     response.status(204).end()
})

const generateId = () => {
  let max = persons.length + 1
  let id = Math.ceil(Math.random() * ( max - persons.length)  + persons.length)
  return id
}

app.post('/api/persons', (request,response) => {
    const person = request.body
    console.log(person)
    if( !person.name || !person.number ) {
        return response.status(400).json(
          {
            "error" : "name or number is missing"
          }
        )
    }else if(persons.find( p => p.name === person.name)) {
      return response.status(400).json(
        {
          "error" : `name must be unique`
        }
      )
    }

    person.id = generateId()
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001

app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
})