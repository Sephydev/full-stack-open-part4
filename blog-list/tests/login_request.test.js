const { describe, test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('when we log in', () => {
  test('with a valid username and password', async () => {
    const user = {
      username: 'Sephydev',
      password: 'test'
    }

    await api
      .post('/api/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('with an invalid username', async () => {
    const user = {
      username: 'Sephirah',
      password: 'test'
    }

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(401)

    assert(response.body.error.includes('invalid username or password'))
  })

  test('with an invalid password', async () => {
    const user = {
      username: 'Sephydev',
      password: 'secret'
    }

    const response = await api
      .post('/api/login')
      .send(user)
      .expect(401)

    assert(response.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  mongoose.connection.close()
})