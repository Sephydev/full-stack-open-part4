const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

userRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body

  if (!password || !username) {
    response.status(400).json({ error: 'username and password are required' })
  }

  if (password.length < 3) {
    response.status(400).json({ error: 'password must be at least 3 character long' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new User({
    username,
    passwordHash,
    name
  })

  try {
    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = userRouter