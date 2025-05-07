const { test, beforeEach, after, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const blog_helper = require('./test_helper')

const api = supertest(app)

describe('when there is initial blogs', () => {
  beforeEach(async () => {
    const initialUser = await blog_helper.createInitialUser()

    await User.deleteMany({})
    await User.insertMany(initialUser)
    await Blog.deleteMany({})
    await Blog.insertMany(await blog_helper.createInitialBlogs())
  })

  describe('when getting blogs', () => {
    test('return all notes in JSON format', async () => {
      const initialBlogs = await blog_helper.createInitialBlogs()

      const blogInDb = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(blogInDb.body.length, initialBlogs.length)
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
      const initialBlogs = await blog_helper.createInitialBlogs()

      const user = {
        username: 'Sephydev',
        password: 'test'
      }

      const newBlog = {
        title: "Cirno Days",
        url: "https://example.com",
        likes: 9
      }

      const responseLogin = await api.post('/api/login')
        .send(user)

      const responseBlog = await api.post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogAfter = await blog_helper.getBlogs()
      const userInDb = await blog_helper.getUsers()

      assert.strictEqual(blogAfter.length, initialBlogs.length + 1)

      const userOfBlogs = blogAfter.map(blog => blog.user.toString())
      const titles = blogAfter.map(blog => blog.title)
      const blogsOfUsers = userInDb[0].blogs.map(user => user.blogs)

      assert(titles.includes('Cirno Days'))
      assert(userOfBlogs.includes(userInDb[0].id.toString()))
      assert(blogsOfUsers.includes(responseBlog.body._id))
      assert(responseBlog.body.author.includes('Sephydev'))
    })

    test("if 'like' property don't exist, set it to 0", async () => {
      const initialBlogs = await blog_helper.createInitialBlogs()

      const newBlog = {
        title: "If it exist, Flandre can break it",
        url: "https://example.com"
      }

      const user = {
        username: 'Sephydev',
        password: 'test'
      }

      const responseLogin = await api.post('/api/login')
        .send(user)

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogAfter = await blog_helper.getBlogs()

      assert.strictEqual(blogAfter.length, initialBlogs.length + 1)
      assert.strictEqual(blogAfter[blogAfter.length - 1].likes, 0)
    })

    test("if 'title' property don't exist, send a 400 status code", async () => {
      const newBlog = {
        url: "https://example.com",
        likes: 9
      }

      const user = {
        username: 'Sephydev',
        password: 'test'
      }

      const responseLogin = await api.post('/api/login')
        .send(user)

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlog)
        .expect(400)
    })

    test("if 'url' property don't exist, send a 400 status code", async () => {
      const newBlog = {
        title: "If it exist, Flandre can break it.",
        likes: 9
      }

      const user = {
        username: 'Sephydev',
        password: 'test'
      }

      const responseLogin = await api.post('/api/login')
        .send(user)

      await api.post('/api/blogs')
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .send(newBlog)
        .expect(400)
    })

    test("if not logged in, send an appropriate status code and error message", async () => {
      const newBlog = {
        title: "Cirno Days",
        url: "https://example.com",
        likes: 9
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('token invalid'))
    })
  })

  describe('when deleting a blog', () => {
    test.only('send a status code of 204', async () => {
      const blogsInDb = await blog_helper.getBlogs()
      const initialBlogs = await blog_helper.createInitialBlogs()
      const blogToDelete = blogsInDb[0]

      const user = {
        username: 'Sephydev',
        password: 'test'
      }

      const responseLogin = await api.post('/api/login')
        .send(user)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${responseLogin.body.token}`)
        .expect(204)

      const blogsAfter = await blog_helper.getBlogs()
      assert.strictEqual(blogsAfter.length, initialBlogs.length - 1)
    })
  })

  describe('when updating a blog', () => {
    test('when id is valid', async () => {
      const initialBlogs = await blog_helper.createInitialBlogs()
      const blogsInDb = await blog_helper.getBlogs()
      const blogToModify = blogsInDb[0]
      blogToModify.likes = 9

      await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(blogToModify)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await blog_helper.getBlogs()
      assert.strictEqual(blogsAfter.length, initialBlogs.length)

      const modifiedBlog = blogsAfter[0]
      assert.strictEqual(modifiedBlog.likes, 9)
    })

    test('when id is invalid', async () => {
      const invalidId = '1234'

      await api.put(`/api/blogs/${invalidId}`).expect(400)
    })

    test("when id is valid but doesn't exist", async () => {
      const validId = await blog_helper.createValidId()

      await api.put(`/api/blogs/${validId}`).expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})