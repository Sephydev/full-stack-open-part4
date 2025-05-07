const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const createInitialUser = async () => {
  const initialUser = [{
    username: 'Sephydev',
    passwordHash: await bcrypt.hash('test', 10),
    name: 'Sephirah'
  }]

  return initialUser
}

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

const getUsers = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const createInitialBlogs = async () => {
  const users = await getUsers()

  const initialBlogs = [{
    title: "Test 1",
    author: "Sephydev",
    url: 'https://example.com',
    user: users[0].id,
    likes: 42,
  },
  {
    title: 'Test 2',
    author: 'Sephydev',
    url: 'https://example.com',
    user: users[0].id,
    likes: 420
  }]

  return initialBlogs
}


module.exports = {
  createInitialUser,
  createInitialBlogs,
  getBlogs,
  getUsers,
  createValidId
}