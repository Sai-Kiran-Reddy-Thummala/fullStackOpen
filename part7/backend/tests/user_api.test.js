const { beforeEach, describe, test, after} = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('../utils/userTest_helper')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const api = supertest(app)

describe('users tests', () => {

    beforeEach(async () => {
        console.log('Inside beforeEach')
        await User.deleteMany()
        const passwordHash = await bcrypt.hash('kiran',10)
        const user = new User({
            username: 'kiran',
            name: 'kiran',
            passwordHash
        })
        await user.save()
    })

    test('user is not added if the username is not unique', async () => {
  console.log('inside username unique test')

  const newUser = {
    username: 'kiran',
    name: 'kiran',
    password: 'kiran'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.error.includes('expected `username` to be unique'))
})

test('unique user is added to the database', async () => {

  const usersBefore = await helper.usersInDB()

  const newUser = {
    username: 'charan',
    name: 'charan',
    password: 'charan'
  }

  await api
  .post('/api/users')
  .send(newUser)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const usersAfter = await helper.usersInDB()
  assert.strictEqual(usersAfter.length, usersBefore.length + 1)
})

})

after(async () => {
    await mongoose.connection.close()
})