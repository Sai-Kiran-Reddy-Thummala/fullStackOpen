const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
                .then(response => {
                    console.log("Connected to mongodb database")
                })
                .catch(error => {
                    console.log("error ",error.message)
                })

const personSchema = new mongoose.Schema({
    name : {
        type : String,
        minLength : 3
    },
    number : Number
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    } 
})
module.exports = mongoose.model('Person',personSchema)


