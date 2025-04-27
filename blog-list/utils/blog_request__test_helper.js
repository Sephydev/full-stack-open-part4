const Blog = require('../models/blog')

const initialBlogs = [{
  title: "Test 1",
  author: "Sephydev",
  url: 'https://example.com',
  likes: 42
},
{
  title: 'Test 2',
  author: 'Sephydev',
  url: 'https://example.com',
  likes: 420
}]

const createValidId = async () => {
  const newBlog = new Blog({
    title: 'willDelete',
    author: 'delete',
    url: 'delete',
    likes: 999
  })

  const noteToDelete = await newBlog.save()
  const validId = noteToDelete.id
  await Blog.findByIdAndDelete(validId)
  return validId
}

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {
  initialBlogs, getBlogs, createValidId
}