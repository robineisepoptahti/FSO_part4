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

const blogToPost = {
    title: "Book3",
    author: "Darwin3",
    url: "url3",
    likes: 3
} 

const likelessBlog = {
  title: "Book4",
  author: "Darwin4",
  url: "url4",
} 

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

test('post 1 blog', async () =>
{
    //Here we are getting the length before adding
    res_len = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

//adding 1 blog.
    const res_new_len = await api
        .post('/api/blogs')
        .send(blogToPost)
        .expect(201)
        .expect('Content-Type', /application\/json/)
assert.strictEqual(res_new_len.body.title, blogToPost.title)
assert.strictEqual(res_new_len.body.url, blogToPost.url)
assert.strictEqual(res_new_len.body.likes, blogToPost.likes)
assert.strictEqual(res_new_len.body.author, blogToPost.author)

//Getting the updated list of blogs
const post_res_len = await api
.get('/api/blogs')
.expect(200)
.expect('Content-Type', /application\/json/)
assert.strictEqual(res_len.body.length + 1, post_res_len.body.length)
}
)

test('test if likes is 0 when not defined', async () => {
  //Cleaning the database
  await Blog.deleteMany({}) 
  //Adding a blog without likes
  const res = await api
  .post('/api/blogs')
  .send(likelessBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)
  assert.strictEqual(res.body.likes, 0)
})
})