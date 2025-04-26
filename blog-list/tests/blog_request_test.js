const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { keys } = require('lodash')

const api = supertest(app)

const initialBlogs = [{
  title: "Test 1",
  author: "Sephydev",
  url: 'https://example.com',
  likes: 42
},
{
  title: 'Test 2',
  author: 'Sephydev',
  url: 'https://example.com',
  likes: 420
}]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('return all notes in JSON format', async () => {
  const blogInDb = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(blogInDb.body.length, initialBlogs.length)
})

test("property '_id' is correctly replaced by 'id'", async () => {
  const blogInDb = await api.get('/api/blogs')
  const keysOfBlog = blogInDb.body.map(blog => Object.keys(blog)).flat()

  assert(keysOfBlog.includes('id'))
  assert(!keysOfBlog.includes('_id'))
})

test.only('create a new blog and save it to the db', async () => {
  const newBlog = {
    title: "Cirno Days",
    author: "Cirno",
    url: "https://example.com",
    likes: 9
  }

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogAfter = await api.get('/api/blogs')

  assert.strictEqual(blogAfter.body.length, initialBlogs.length + 1)

  const contents = blogAfter.body.map(blog => blog.title)
  assert(contents.includes('Cirno Days'))
})

after(async () => {
  await mongoose.connection.close()
})