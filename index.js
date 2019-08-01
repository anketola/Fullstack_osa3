const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('reqBody', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny')) 
app.use(morgan(':method :url :reqBody :status :res[content-length] - :response-time ms'))


const newId = () => {
  return Math.floor(Math.random() * 10000)
}

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": 1
  },
  { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": 2
  },
  { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": 3
  },
  { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": 4
  }
]
  
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people. <p><br /> ${new Date}`)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name && !body.number) {
    return response.status(400).json({ 
      error: 'name and number missing from the entry' 
    })
  }
  
  if (!body.name) {
    return response.status(400).json({ 
      error: 'number missing from the entry' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing from the entry' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    "name": body.name,
    "number": body.number,
    "id": newId()
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
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