const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response) => {
    let timestamp = new Date()

    Person.find({}).then(persons => {
        response.send(`<p>Phonebook has info for ${persons.length} people </p>  <p>${timestamp}</p>`)
    })

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    let name = persons.find(name => name.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "The name or number is missing"
        })
    }
    if (name) {
        return response.status(400).json({
            error: "The name already exists in the phonebook"
        })
    }

    const person = {
        id: Math.floor(Math.random() * 20000),
        name: body.name,
        number: body.number
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