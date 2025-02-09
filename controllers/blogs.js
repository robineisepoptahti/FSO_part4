const notesRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')

 notesRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
    })
  
    
  notesRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
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