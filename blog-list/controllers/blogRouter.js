const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (require, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  try {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)

    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: 'token invalid' })
    // }

    // const user = await User.findById(decodedToken.id)

    const user = request.user

    if (!request.body.title || !request.body.url) {
      response.status(400).end()
    }

    const blog = new Blog({
      title: request.body.title,
      author: user.username,
      url: request.body.url,
      user: user._id,
      likes: request.body.likes || 0
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(blog.id)
      response.status(204).end()
    }
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  try {
    const blogToModify = await Blog.findById(request.params.id)

    if (!blogToModify) {
      response.status(404).end()
    }

    blogToModify.likes = request.body.likes
    const savedBlog = await blogToModify.save()
    response.send(200).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogRouter