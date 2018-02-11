const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

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
  console.log("> GET: /api/persons")

  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  console.log("> GET: /api/persons/" + req.params.id)

  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if ( person ) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  console.log("> DELETE: /api/persons/" + req.params.id)

  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

// TODO: Should collisions be handled??
const generateId = () => {
  let id
  while (true) {
    id = Math.floor(Math.random() * Math.floor(9999999))
    if (!persons.find(p => p.id === id)) break
  }
  return id
}

app.post('/api/persons', (req, res) => {
  console.log("> POST: /api/persons")
  console.log("  > Content-Type:", req.headers['content-type'])
  console.log("  > Body:", req.body)

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
  console.log("> GET: /info")

  responseHtml = "<p>puhelinluettelossa " + persons.length + " henkilön tiedot</p>" +
                 "<p>" + new Date() + "</p>"

  res.send(responseHtml)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})