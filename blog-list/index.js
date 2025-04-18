const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const Blog = require('./models/blog')

const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

app.use(logger)

mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
    .catch(error => next(error))
})

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})