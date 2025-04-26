const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const Blog = require('./models/blog')
const blogRouter = require('./controllers/blogRouter')

const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

app.use(logger)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connecting to MongoDB')
  })
  .catch(error => console.log(error.message))

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app