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

const getBlogs = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {
  initialBlogs, getBlogs
}