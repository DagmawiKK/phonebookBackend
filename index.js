require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const Person = require("./models/phonebook") 

const morgan = require("morgan")
app.use(express.json())


app.use(cors())
morgan.token('postData', (request) => {
    if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
    else return ' ';
  });
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

console.log("sdsjk")

app.get("/api/persons/", (req, res) => {
    Person.find({}).then(result => res.json(result))
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
            if(!Person) {
                return res.status(404).json({error: "Contact not found"})
            }
            res.json(person)
        })
})

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id != id)
    res.status(204).end()
})

const generateID = () => String(Math.floor(Math.random() * 100000) )

app.post("/api/persons/", (req, res) => {
    const body = req.body
    if(!body.name) {
        return res.status(400).json({error: "Name not entered"}).end()
    }
    else if (!body.number) {
        return res.status(400).json({error: "Number not entered"}).end()
    }
    else {
        Person.find({})
            .then(result => {
                return result.some(person => person.name == body.name)
            })
            .then(found => {
                if(found) {
                    return res.status(400).json({error: "name must be unique"}).end()
                }
                const newPerson = new Person({
                    name: body.name,
                    number: body.number
                })
            
                newPerson.save().then(result => res.status(201).json(result).end("added user"))
            })
    }
    
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`App running on port: ${PORT}`)