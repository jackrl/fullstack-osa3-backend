const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Person = require('./models/person')

app.use(bodyParser.json())
app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      res.status(500)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }
  if (body.number === undefined){
    return res.status(400).json({error: 'number missing'})
  }
  // Handled in later exercise
  /*
  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({error: 'name must be unique'})
  }
  */

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      res.json(Person.format(savedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(500)
    })
})

app.get('/info', (req, res) => {
  responseHtml = "<p>puhelinluettelossa " + persons.length + " henkilön tiedot</p>" +
                 "<p>" + new Date() + "</p>"

  res.send(responseHtml)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})