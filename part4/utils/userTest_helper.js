const User = require('../models/user')
const bcrypt = require('bcrypt')

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const nonExistingUser = async () => {

    const passwordHash = await bcrypt.hash('root3', 10)

    const user = new User({
        username: 'root3',
        name: 'root3',
        passwordHash
    })

    await user.save()
    await user.deleteOne()
    return {
        username: user.username,
        id: user._id
    }
}

module.exports = {
    usersInDB,
    nonExistingUser
}