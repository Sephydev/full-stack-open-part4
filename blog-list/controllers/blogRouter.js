const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (require, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  try {
    if (!request.body.title || !request.body.url) {
      response.status(400).end()
    }

    const blog = new Blog({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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