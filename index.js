const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  },
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if ( person ) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

const generateId = () => {
  let id
  while (true) {
    id = Math.floor(Math.random() * Math.floor(9999999))
    if (!persons.find(p => p.id === id)) break
  }
  return id
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  if (body.number === undefined){
    return res.status(400).json({error: 'number missing'})
  }
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  res.json(person)
})

app.get('/info', (req, res) => {
  responseHtml = "<p>puhelinluettelossa " + persons.length + " henkilön tiedot</p>" +
                 "<p>" + new Date() + "</p>"

  res.send(responseHtml)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})