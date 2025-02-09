const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const { update } = require('lodash')

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
const titlelessBlog = {
  author: "Darwin4",
  url: "url4",
} 

const updateBlog = { 
    title: "Book1",
    author: "Darwin1",
    url: "url1",
    likes: 20
}

  describe('API tests (initially 2 blogs saved)', () => {
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

test('test if status code 400 is returned when post has no title or url.', async () =>
{
  const res = await api
  .post('/api/blogs')
  .send(titlelessBlog)
  .expect(400)
}
)
test('delete a blog', async () => {

  //Get the blogs and id:s 
 const res = await api
   .get('/api/blogs')
   .expect(200)
   .expect('Content-Type', /application\/json/)
 //Delete the first blog
 await api
 .delete(`/api/blogs/${res.body[0].id}`)
 .expect(204)
 //Get the bloglist to check the length
 const res_len = await api
 .get('/api/blogs')
 .expect(200)
 .expect('Content-Type', /application\/json/)
 assert.strictEqual(res_len.body.length, 1)
 })

})


describe('API tests for deleting', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
  })
  test('delete a blog', async () => {

   //Get the blogs and id:s 
  const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  //Delete the first blog
  await api
  .delete(`/api/blogs/${res.body[0].id}`)
  .expect(204)
  //Get the bloglist to check the length
  const res_len = await api
  .get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
  assert.strictEqual(res_len.body.length, 1)
  })
  
})

describe('API  tests for updating', () => {
  test('checks if response matches update', async () =>{
    //Get the blogs and id:s
    const res = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const updated_res = await api
    .put(`/api/blogs/${res.body[0].id}`)
    .send(updateBlog)
    .expect(200)
    assert.strictEqual(updated_res.body.likes, updateBlog.likes)
  })
})


after(async () => {
  await mongoose.connection.close()
})
