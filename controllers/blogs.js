const notesRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
require('express-async-errors')
const jwt = require('jsonwebtoken')

 notesRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
    })
  
  const getTokenFrom = request => {
      const authorization = request.get('authorization')
      if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
      }
      return null
    }

    
  notesRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    
    const blog = new Blog({
      author: request.body.author,
      title: request.body.title,
      url: request.body.url,
      likes: request.body.likes,
      user: user}
    )
    if (!blog.title || !blog.url)
    {
      response.status(400).end()
      return
    }
    const result = await blog.save()
    response.status(201).json(result)
  })

  notesRouter.delete('/:id', async (request, response) => {
    const res = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  })
  
  notesRouter.put('/:id', async (request, response) => {
    const res = await Blog.findByIdAndUpdate(request.params.id, request.body,{ new: true })
    response.json(res)
  })
  
  module.exports = notesRouter