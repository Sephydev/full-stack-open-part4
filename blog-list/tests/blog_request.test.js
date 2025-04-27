const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const blog_helper = require('../utils/blog_request__test_helper')
const { keys } = require('lodash')

const api = supertest(app)

describe('when there is initial blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blog_helper.initialBlogs)
  })

  describe('when getting blogs', () => {
    test('return all notes in JSON format', async () => {
      const blogInDb = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(blogInDb.body.length, blog_helper.initialBlogs.length)
    })

    test("property '_id' is correctly replaced by 'id'", async () => {
      const blogInDb = await blog_helper.getBlogs()
      const keysOfBlog = blogInDb.map(blog => Object.keys(blog)).flat()

      assert(keysOfBlog.includes('id'))
      assert(!keysOfBlog.includes('_id'))
    })
  })

  describe('when a new blog is created', () => {
    test('create a new blog and save it to the db', async () => {
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

      const blogAfter = await blog_helper.getBlogs()

      assert.strictEqual(blogAfter.length, blog_helper.initialBlogs.length + 1)

      const titles = blogAfter.map(blog => blog.title)
      assert(titles.includes('Cirno Days'))
    })

    test("if 'like' property don't exist, set it to 0", async () => {
      const newBlog = {
        title: "If it exist, Flandre can break it",
        author: "Flandre Scarlet",
        url: "https://example.com"
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogAfter = await blog_helper.getBlogs()

      assert.strictEqual(blogAfter.length, blog_helper.initialBlogs.length + 1)
      assert.strictEqual(blogAfter[blogAfter.length - 1].likes, 0)
    })

    test("if 'title' property don't exist, send a 400 status code", async () => {
      const newBlog = {
        author: "Flandre Scarlet",
        url: "https://example.com",
        likes: 9
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })

    test("if 'url' property don't exist, send a 400 status code", async () => {
      const newBlog = {
        title: "If it exist, Flandre can break it.",
        author: "Flandre Scarlet",
        likes: 9
      }

      await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
    })
  })

  describe('when deleting a blog', () => {
    test('send a status code of 204', async () => {
      const blogsInDb = await blog_helper.getBlogs()
      const blogToDelete = blogsInDb[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAfter = await blog_helper.getBlogs()
      assert.strictEqual(blogsAfter.length, blog_helper.initialBlogs.length - 1)
    })
  })

  describe('when updating a blog', () => {
    test('when id is valid', async () => {
      const blogsInDb = await blog_helper.getBlogs()
      const blogToModify = blogsInDb[0]
      blogToModify.likes = 9

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await blog_helper.getBlogs()
      assert.strictEqual(blogsAfter.length, blog_helper.initialBlogs.length)

      const modifiedBlog = blogsAfter[0]
      assert.strictEqual(modifiedBlog.likes, 9)
    })

    test('when id is invalid', async () => {
      const invalidId = '1234'

      await api.put(`/api/blogs/${invalidId}`).expect(400)
    })

    test.only("when id is valid but doesn't exist", async () => {
      const validId = await blog_helper.createValidId()

      await api.put(`/api/blogs/${validId}`).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})