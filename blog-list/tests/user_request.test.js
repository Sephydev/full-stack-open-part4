const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const { test, beforeEach, after, describe } = require('node:test')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

describe('when db has initially one user', async () => {
  beforeEach(async () => {
    const initialUser = await helper.createInitialUser()

    await User.deleteMany({})
    await User.insertMany(initialUser)
  })

  describe('when getting user', () => {
    test('return in the good format the user', async () => {
      const initialUser = await helper.createInitialUser()

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.length, initialUser.length)
    })
  })

  describe('when creating a new user', () => {
    test('return correct status code and save the user to db is data is valid', async () => {
      const initialUser = await helper.createInitialUser()
      const newUser = {
        username: 'mluukainen',
        password: 'secret',
        name: 'mluuk'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersInDb = await helper.getUsers()

      assert.strictEqual(usersInDb.length, initialUser.length + 1)

      const usernames = usersInDb.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })

    test("return correct status code and error message, don't save user if username is missing", async () => {
      const initialUser = await helper.createInitialUser()
      const newUser = {
        password: 'secret',
        name: 'mluuk'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error.includes('username and password are required'))

      const usersInDb = await helper.getUsers()

      assert.strictEqual(usersInDb.length, initialUser.length)
    })

    test("return correct status code and error message, don't save user if password is missing", async () => {
      const initialUser = await helper.createInitialUser()
      const newUser = {
        username: 'mluukainen',
        name: 'mluuk'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error.includes('username and password are required'))

      const usersInDb = await helper.getUsers()

      assert.strictEqual(usersInDb.length, initialUser.length)
    })

    test("return correct status code and error message, don't save user if username is already taken", async () => {
      const initialUser = await helper.createInitialUser()

      const newUser = {
        username: 'Sephydev',
        password: 'test',
        name: 'Sephirah'
      }

      const response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert(response.body.error.includes('username is already taken'))

      const usersInDb = await helper.getUsers()

      assert.strictEqual(usersInDb.length, initialUser.length)
    })
  })
})

after(async () => {
  mongoose.connection.close()
})