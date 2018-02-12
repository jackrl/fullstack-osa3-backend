const mongoose = require('mongoose')

const url = "not for you github ;)"

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const name = process.argv[2]
const number = process.argv[3]

if (name) {
  const person = new Person({
    name,
    number
  })

  person
    .save()
    .then(response => {
      console.log("lisätään henkilö", name, "numero", number, "luetteloon")
      mongoose.connection.close()
    })
} else {
  Person
    .find({})
    .then(result => {
      console.log("puhelinluettelo:")
      result.forEach(p => {
        console.log(p.name, p.number)
      })
      mongoose.connection.close()
    })
}

