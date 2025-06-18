let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

// app.use(
// morgan(function (tokens,request,response) {
//   return [
//     tokens.method(request,response),
//     tokens.url(request,response),
//     tokens.status(request,response)
//   ].join(' ')
// }))

morgan.token('postBody', function(request,response) { return JSON.stringify(request.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'));

app.get('/',(request,response) => {
    response.send("<h1>Hello World!!</h1>")
})

app.get('/api/persons',(request,response) => {
    response.json(persons)
})

app.get('/info',(request,response) => {
    const info = `
    <div>
        <p> Phonebook has info of ${persons.length} people</p>
        <p>${new Date()}</p>
    </div>
    `

    response.send(info)
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find(p => p.id === id)

    if(person){
      response.json(person)
    }else {
    response.status(404).send({"error":"Resource not found"})
    }
})

app.delete('/api/persons/:id',(request,response) => {
    const id = request.params.id
    persons = persons.filter( p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
  const maxId = Math.max(...persons.map(p => Number(p.id)))
  return String(Math.floor(Math.random() * (1000 - maxId) + maxId));
}

const isNameUnique = name => !persons.find(p => p.name === name)

app.post('/api/persons', (request,response) => {
  
  const name = request.body.name
  const number = request.body.number
  
  if(!name && !number){
    return response.status(400)
                    .send({"error":"name and number is missing"})
  }
  if(!name){
    return response.status(400)
                    .send({"error":"name is missing"})
  }
  if(!number){
    return response.status(400)
                    .send({"error":"number is missing"})
  }

  if (!isNameUnique(name)) {
    return response.status(400)
                    .send({ error: "name must be unique" });
  }

  const person = {
    name,
    number,
    "id" : generateId()
  }

    persons = persons.concat(person)
    response.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

