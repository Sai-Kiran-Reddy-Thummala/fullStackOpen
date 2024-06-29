const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const Person = require("./models/person")
require('dotenv').config()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

/*
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
*/

app.get('/', (request, response) => {
    response.send('<h1>Welcome!!</h1>')
})

app.get('/info', (request, response) => {
    console.log("in info")
    const date = new Date()
    response.send(`<p>Phonebook has info for ${persons.length} people <br /> ${date}<p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
      response.json(result)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
          .then(returnedPerson => {
            if(returnedPerson){
              response.json(returnedPerson)
            }else {
              response.status(400).end()
            }
          })
          .catch(error => next(error) )
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
                .then(returnedPerson => {
                  response.status(204).end()
                })
                .catch(error => next(error))
})

/*
const generateId = () => {
    let max = persons.length + 1
    let id = Math.ceil(Math.random() * (max - persons.length) + persons.length)
    return id
}
*/

app.post('/api/persons', (request, response) => {
    const tempPerson = request.body

    if(tempPerson.name === undefined) {
      response.status(400).json({error : "Name or number is missing"})
    }else {
      const person = new Person({
        name : tempPerson.name,
        number : tempPerson.number
      })

      person.save().then(savedPerson => {
        console.log("Person saved to the database")
        response.json(savedPerson)
      })
    }
})

app.put('/api/persons/:id',(request,response,next) => {
    const body = request.body

    const person = {
      name : body.name,
      number : body.number
    }

    Person.findByIdAndUpdate(request.params.id,person, {new : true})
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => next(error))
})

app.use(unknownEndpoint)

const handleError = (error, request, response, next) => {
      console.log(error.message)

      if(error.name === "CastError"){
        return response.status(400).send({error : "malformatted id"})
      } 
      
      next(error)
}

app.use(handleError)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
