const mongoose = require('mongoose')

const url = 'not for you github ;)'

mongoose.connect(url)

let personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

const Person = mongoose.model('Person', personSchema)


module.exports = Person