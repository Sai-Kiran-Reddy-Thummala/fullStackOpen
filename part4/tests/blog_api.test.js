const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')

const Blog = require('../models/blog')
const User = require('../models/user')

const blogHelper = require('../utils/test_helper')
const userHelper = require('../utils/userTest_helper')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const mongoose = require('mongoose')

let savedUser = ''
let token = ''

describe('http://localhost:3003/api/blogs tests', () => {

    beforeEach(async () => {
        await Blog.deleteMany()
        await User.deleteMany()

        const saltRounds = 10
        const passwordHash = await bcrypt.hash('root', saltRounds)

        const user = new User({
            username: 'root',
            name: 'root',
            passwordHash
        })

        savedUser = await user.save()
        token = jwt.sign({ username: savedUser.username, id: savedUser._id }, process.env.SECRET)

        const blogObjects = blogHelper.initialBlogs.map(blog => new Blog({ ...blog, user: savedUser._id }))
        const blogPromises = blogObjects.map(blog => blog.save())
        await Promise.all(blogPromises)
    })

    test('blogs returned from http://localhost:3003/api/blogs', async () => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogsInDB = await blogHelper.blogsInDb()
        assert.strictEqual(blogs.body.length, blogsInDB.length)
    })

    test('blogs returned from http://localhost:3003/api/blogs has property named `id`', async () => {
        const response = await api.get('/api/blogs')
        const blogs = response.body
        for (const blog of blogs) {
            assert.ok(blog.hasOwnProperty('id'))
        }
    })

    test('adding a blog to http://localhost:3003/api/blogs by token authentication', async () => {

        const blog = {
            url: "https://example.com/javascript-basics",
            title: "JavaScript Basics",
            author: "John Doe",
            likes: 120
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // Re-used token from beforeEach
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAfter = await blogHelper.blogsInDb()
        assert.strictEqual(blogsAfter.length, blogHelper.initialBlogs.length + 1)
    })

    test('adding a blog fails at http://localhost:3003/api/blogs if token is not provided', async () => {

        const blogsBefore = await blogHelper.blogsInDb()

        const blog = {
            url: "https://medium.com/frontend-tricks/css-grid-guide",
            title: "A Complete Guide to CSS Grid",
            author: "Jane Smith",
            likes: 85
        }

        await api
            .post('/api/blogs')
            .send(blog)
            .expect(401)

        const blogsAfter = await blogHelper.blogsInDb()
        assert.strictEqual(blogsAfter.length, blogsBefore.length)

    })

    test('adding a blog fails at http://localhost:3003/api/blogs if user is invalid', async () => {
        const blogsBefore = await blogHelper.blogsInDb()

        const invalidUser = await userHelper.nonExistingUser()
        const token = jwt.sign(invalidUser, process.env.SECRET)

        const blog = {
            url: "https://dev.to/techguy/python-for-beginners-3n4",
            title: "Python for Beginners",
            author: "Tech Guy",
            likes: 200
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(blog)
            .expect(401)

        const blogsAfter = await blogHelper.blogsInDb()
        assert.strictEqual(blogsAfter.length, blogsBefore.length)

    })

    test('adding a blog fails at http://localhost:3003/api/blogs if title or url is missing', async () => {

        const blogsBefore = await blogHelper.blogsInDb()

        const incompleteBlog = {
            author: 'Sai Kiran Reddy',
            likes: 24
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`) // re-used token from beforeEach
            .send(incompleteBlog)
            .expect(400)

        const blogsAfter = await blogHelper.blogsInDb()
        assert.strictEqual(blogsAfter.length, blogsBefore.length)
    })

    describe('deleting a blog at http://localhost:3003/api/blog', () => {
        test('deleting succeeds with 204 if user is the one deleting', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToDelete = blogsBefore[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`) // re-used token from beforeEach
                .expect(204)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length - 1)
        })

        test('deleting a blog fails at http://localhost:3003/api/blogs if user other than the creator tries to delete', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToDelete = blogsBefore[0]
            const passwordHash = await bcrypt.hash('root4', 10)
            const user = new User({
                username: 'root4',
                name: 'root4',
                passwordHash
            })
            const savedUser = await user.save()

            const token = jwt.sign({ username: savedUser.username, id: savedUser._id }, process.env.SECRET)

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(401)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)
        })

        test('deleting fails if token is not sent with the request', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToDelete = blogsBefore[0]

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(401)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)
        })
    })

    describe('updating the blogs at http:localhost:3003/api/blogs', () => {
        test('updating succeeds with 200 if creator is the one updating', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToUpdate = blogsBefore[0]

            const updatedData = {
                url: "https://overreacted.io/",
                title: "Overreacted",
                author: "Dan Abramov",
                likes: 15
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)
        })

        test('updating fails if other than creator tries to update', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToUpdate = blogsBefore[0]

            const updatedData = {
                url: "https://overreacted.io/",
                title: "Overreacted",
                author: "Dan Abramov",
                likes: 15
            }

            const passwordHash = await bcrypt.hash('root4', 10)
            const user = new User({
                username: 'root4',
                name: 'root4',
                passwordHash
            })
            const savedUser = await user.save()

            const token = jwt.sign({ username: savedUser.username, id: savedUser._id }, process.env.SECRET)

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(401)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)
        })

        test('updating fails if token is not sent with the request', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const blogToUpdate = blogsBefore[0]

            const updatedData = {
                url: "https://overreacted.io/",
                title: "Overreacted",
                author: "Dan Abramov",
                likes: 15
            }

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .expect(401)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)
        })

        test('updating fails with 400 if invalid blog id is sent with the request', async () => {
            const blogsBefore = await blogHelper.blogsInDb()
            const { nonExistingId, token, userId } = await blogHelper.nonExistingId()

            const updatedData = {
                url: "https://overreacted.io/",
                title: "Overreacted",
                author: "Dan Abramov",
                likes: 15
            }

            const response = await api
                .put(`/api/blogs/${nonExistingId}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(400)

            const blogsAfter = await blogHelper.blogsInDb()
            assert.strictEqual(blogsAfter.length, blogsBefore.length)

            await User.findByIdAndDelete(userId)
        })
    })
})

after(async () => {
    mongoose.connection.close()
})