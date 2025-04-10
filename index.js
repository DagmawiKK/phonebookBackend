const express = require("express")
const app = express()
const cors = require("cors")

const morgan = require("morgan")
app.use(express.json())


app.use(cors())
morgan.token('postData', (request) => {
    if (request.method == 'POST') return ' ' + JSON.stringify(request.body);
    else return ' ';
  });
  
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get("/info/", (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${date.toUTCString()}</p>`)
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const contact = persons.find(p => p.id == id)

    if(!contact) {
        return res.status(404).json({error: "Contact not found"})
    }
    res.json(contact)

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
        const found = persons.some(person => person.name === body.name)
        if(found) {
            return res.status(400).json({error: "name must be unique"}).end()
        }
    }

    const newPerson = {
        "id": generateID(),
        "name" : body.name,
        "number" : body.number,
    }

    persons = persons.concat(newPerson)
    res.status(201).json(newPerson).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`App running on port: ${PORT}`)