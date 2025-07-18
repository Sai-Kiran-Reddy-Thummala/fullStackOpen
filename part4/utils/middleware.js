const jwt = require('jsonwebtoken')
const User = require('../models/user')
const morgan = require('morgan')

const unknownEndpoints = (request,response) => {
    response.status(400).send({error: "unknown endpoint"})
}

// if(process.env.NODE_ENV !== 'test'){
// morgan.token('postBody', (request,response) => JSON.stringify(request.body) )
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
// }

morgan.token('postBody', (request,response) => JSON.stringify(request.body) )
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :postBody')


const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if(authorization && authorization.startsWith('Bearer ')){
        request.token = authorization.replace('Bearer ', '')
    }else {
        request.token = null
    }
    
    next()
}

const userExtractor = async (request, response, next) => {

    if(!request.token){
        return response.status(401).json({error: 'Token Invalid: missing'})
    }
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if(!decodedToken.id){
        return response.status(401).json({error: 'Token Invalid: missing id'})
    }

    const user = await User.findById(decodedToken.id)

    if(!user){
        return response.status(401).json({error: 'user not found'})
    }

    request.user = user
    next()
}

const errorHandler = (error,request,response,next) => {
   
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }else if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: 'expected `username` to be unique' })
    }else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({error: 'token invalid'})
    }else if(error.name === 'TokenExpiredError'){
        return response.status(401).json({error: 'token expired'})
    }

    next(error)
}

module.exports = {unknownEndpoints,
    morganMiddleware,
    errorHandler,
    tokenExtractor,
    userExtractor
}