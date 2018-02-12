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
      res.status(500).end()
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(Person.format(person))
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error: 'malformatted if' })
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined) {
    return res.status(400).json({ error: 'name missing' })
  }
  if (body.number === undefined){
    return res.status(400).json({ error: 'number missing' })
  }

  Person
    .find({ name: body.name })
    .then(result => {
      if (result.length === 0) {
        const person = new Person ({
          name: body.name,
          number: body.number
        })

        person
          .save()
          .then(Person.format)
          .then(person => {
            res.json(person)
          })
          .catch(error => {
            console.log(error)
            res.status(500).end()
          })
      } else {
        res.status(409).json({ error: 'name already exists' })
      }
    })

})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(Person.format)
    .then(person => {
      res.json(person)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
  Person
    .count({}, (error, count) => {
      const responseHtml = '<p>puhelinluettelossa ' + count + ' henkilön tiedot</p>' +
                 '<p>' + new Date() + '</p>'

      res.send(responseHtml)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})