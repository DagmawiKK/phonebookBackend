const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => console.log("Database connected"))
    .catch(error => console.log("Error while connecting: ", error))

const personSchema = new mongoose.Schema({
    name: String,
    number: Number
})


personSchema.set("toJSON", {
    transform:(document, returnObj) => {
        returnObj.id = returnObj._id.toString()
        delete returnObj._id
        delete returnObj.__v
    }
})

const Person = mongoose.model("Person", personSchema)

module.exports = Person

