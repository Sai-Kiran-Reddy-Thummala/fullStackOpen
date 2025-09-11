require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

const url = config.MONGODB_URI

logger.info('connecting to', url)

mongoose.connect(url)
    .then(result => {
        logger.info('connected to mongodb')
    })
    .catch(error => {
        logger.error(error.message)
    })

app.use(express.json())
app.use(middleware.morganMiddleware)
app.use(middleware.tokenExtractor)

if (process.env.NODE_ENV === "test") {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoints)
app.use(middleware.errorHandler)

module.exports = app