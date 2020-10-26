const express = require('express');
const morgan = require('morgan');
const { response } = require('express');
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('request-data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-data'));

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  },
  {
    name: "Manny Poppe",
    number: "39-23-64231234",
    id: 5
  }
]

const generateId = () => {
  const maxID = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxID + 1
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person.name) {
    response.json(person)
  } else {
    response.status(404).end()
  }
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people<p>
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

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  if(persons.find(p => p.name === person.name)) {
    return response.status(409).json({
      error: 'name must be unique'
    })
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})