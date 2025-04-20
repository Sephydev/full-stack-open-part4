const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const listWithZeroBlog = []
const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlog = [
  {
    _id: "5a422a851b54a676234f17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234f17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violation/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234f17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234f17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234f17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422a851b54a676234f17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('when list is empty, return 0', () => {
    const result = listHelper.totalLikes(listWithZeroBlog)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has multiple blog, calculate correctly', () => {
    const result = listHelper.totalLikes(listWithMultipleBlog)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('when list is empty, return empty object', () => {
    const result = listHelper.favoriteBlog(listWithZeroBlog)
    assert.deepStrictEqual(result, {})
  })

  test('when list has only one blog, equals this post', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(
      result,
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 5,
        __v: 0
      }
    )
  })

  test('when list has multiple blogs, find the blog with most likes', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlog)
    assert.deepStrictEqual(
      result,
      {
        _id: "5a422a851b54a676234f17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
      }
    )
  })
})

describe('most blogs', () => {
  test('when list is empty, return empty object', () => {
    const result = listHelper.mostBlogs(listWithZeroBlog)
    assert.deepStrictEqual(result, {})
  })

  test('when list has one blog, return the author of the blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('when list has multiple blogs, find the author with the most post', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlog)
    assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
  })
})