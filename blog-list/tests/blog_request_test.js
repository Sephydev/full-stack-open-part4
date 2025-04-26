const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

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
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogInDb = await Blog.find({})
  assert.strictEqual(blogInDb.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})