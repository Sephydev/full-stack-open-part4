const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const logger = (request, response, next) => {
  console.log('METHOD:', request.method)
  console.log('PATH:', request.path)
  console.log('BODY:', request.body)
  console.log('---')
  next()
}

app.use(logger)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

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

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})