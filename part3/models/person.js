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
    number : {
        type: String,
        validate : {
            validator : v => {
                const regEx = /\d{2,3}-\d{7,}/
                return regEx.test(v)
            },
            message : props => `${props.value} is not a valid number`
        },
        minLength : 8,
        required : true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    } 
})
module.exports = mongoose.model('Person',personSchema)


