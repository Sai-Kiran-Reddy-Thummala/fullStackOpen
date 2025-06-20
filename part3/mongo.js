const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as command line argument')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://saikiranreddythummala:${password}@cluster0.8tebjgn.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person',personSchema)

if(process.argv.length === 3){
    Person.find({}).then(response => {
        console.log('phonebook:')
        response.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}else{
    const person = new Person({
    name : process.argv[3],
    number : process.argv[4]
})

    person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
})
}

