const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogRouter')
const userRouter = require('./controllers/userRouter')
const loginRouter = require('./controllers/loginRouter')

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

app.use(middleware.tokenExtractor)

app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)

module.exports = app