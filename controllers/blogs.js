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
  
  module.exports = notesRouter