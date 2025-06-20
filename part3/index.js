require('dotenv').config()              //imports dotenv and will be available throughout the code
const express = require('express')      // imports express
const morgan = require('morgan')        // imports morgan middleware
const Person = require('./models/person') // imports person model from person file in modes folder/dir
const app = express()
app.use(express.static('dist'))
app.use(express.json())
morgan.token('postBody', function(request,response) { return JSON.stringify(request.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
app.get('/',(request, response) => {
  response.send('<h1>Hello World!!</h1>')
})
app.get('/api/persons',(request,response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})
app.get('/info',(request,response) => {
  Person.countDocuments({}).then(count => {
    const info = `
    <div>
        <p> Phonebook has info of ${count} people</p>
        <p>${new Date()}</p>
    </div>
    `
    response.send(info)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id',(request,response,next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(request,response,next) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})
app.post('/api/persons', (request,response,next) => {
  const name = request.body.name
  const number = request.body.number
  if(!name && !number){
    return response.status(400)
      .send({ 'error':'name and number is missing' })
  }
  if(!name){
    return response.status(400)
      .send({ 'error':'name is missing' })
  }
  if(!number){
    return response.status(400)
      .send({ 'error':'number is missing' })
  }
  const newPerson = new Person({
    name: request.body.name,
    number: request.body.number
  })
  newPerson
    .save()
    .then(returnedObject => {
      response.json(returnedObject)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next) => {
  const { name, number } = request.body
  const updateData = {}
  if( number !== undefined){
    updateData.number = number
  }
  Person.findByIdAndUpdate(request.params.id,updateData,{
    new: true,
    runValidators: true
  }).then(updatedPerson => {
    if(!updatedPerson){
      response.status(400).end()
    }
    response.json(updatedPerson)
  })
    .catch(error => next(error))
})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error : 'Unknown Endpoint' })
}
app.use(unknownEndpoint)
const errorHandler = (error,request,response,next) => {
  console.log(error.message)
  if(error.name === 'CastError'){
    return response.status(404).send({ error: 'malformatted id' })
  }else if(error.name === 'ValidationError'){
    return response.status(400).json({ error : error.message })
  }
  next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
