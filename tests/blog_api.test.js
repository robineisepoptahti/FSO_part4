const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)


const initialBlogs = [
    {
    title: "Book1",
    author: "Darwin1",
    url: "url1",
    likes: 1
    },
    {
    title: "Book2",
    author: "Darwin2",
    url: "url2",
    likes: 2
    }
  ]

  describe('when there is initially 2 blogs saved', () => {
beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })


test('right amount of blogs are returned as json', async () => {
    res = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.equal(res.body.length, 2)
})
after(async () => {
    await mongoose.connection.close()
  })

test('check if id is defined in response', async () => {
    res = await api.get('/api/blogs')
    res.body.forEach(blog => assert(blog.id))
})

})