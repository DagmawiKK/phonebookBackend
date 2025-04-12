require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.static('dist'))

const Person = require("./models/phonebook") 

const morgan = require("morgan")
app.use(express.json())


app.use(cors())
morgan.token('postData', (request) => {
    if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
    else return ' ';
  });
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

app.get("/api/persons/", (req, res) => {
    Person.find({}).then(result => res.json(result))
                .catch(error => {
                    console.log(error)
                    res.status(500).end()
                })
})

app.get("/info/", (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${date.toUTCString()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    Person.findById(id)
        .then(person => {
            if(!person) {
                return res.status(404).json({error: "Contact not found"})
            }
            res.json(person)
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(person => {
            if (!person) {
                return res.status(404).json({error: "person not found"})
            }
            res.status(204).end()
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.post("/api/persons/", (req, res) => {
    const body = req.body
    if(!body.name) {
        return res.status(400).json({error: "Name not entered"}).end()
    }
    else if (!body.number) {
        return res.status(400).json({error: "Number not entered"}).end()
    }
    else {
        Person.findOne({name: body.name})
            .then(exists => {
                if (exists) {
                    return res.status(400).json({error: "name must be unique"}).end()
                }

                const newPerson = new Person({
                    name: body.name,
                    number: body.number
                })
            
                return newPerson.save()
                
            })
            .then(result => res.status(201).json(result).end("added user"))
            .catch(error => {
                console.log(error)
                res.status(500).end()
            })
    }
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`App running on port: ${PORT}`)