require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const { response } = require('express');
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('request-data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-data'));

app.get('/api/persons', (request, response) => {
  Person.find().then(persons => {
    response.json(persons)
  })
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${Person.find.length} people<p>
     <p>${new Date()}<p>`
    );
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})