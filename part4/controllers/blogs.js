const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username:1, name: 1, id:1})
  response.status(200).json(blogs)
})

blogsRouter.get('/:id', async (request,response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogsRouter.post('/', middleware.tokenExtractor, middleware.userExtractor ,async (request, response) => {

  const body = request.body
  const user = request.user

   if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
     url : body.url,
     title: body.title,
     author: body.author,
     user: user._id,
     likes: body.likes
  })
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.tokenExtractor,middleware.userExtractor,async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  
  if(!blog){
    return response.status(204).end()
  }

  const user = request.user

  if(blog.user.toString() === user.id.toString()){
    await blog.deleteOne()
    return response.status(204).end()
  }else {
    return response.status(401).json({error: 'Only creator can delete this blog'})
  }

})

blogsRouter.put('/:id', middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
  
  const body = request.body
  const blog = await Blog.findById(request.params.id)

  if(!blog){
    return response.status(400).json({error: 'blog does not exist or removed from the server'})
  }

  if(blog.user.toString() !== request.user.id.toString()){
    return response.status(401).json({error: 'unauthorized to update this blog'})
  }

 const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, {new: true})
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter