const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, post) => {
    const likes = post.likes
    return sum + likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  let favoritePost = {}

  blogs.forEach(post => {
    if (post.likes >= maxLikes) {
      maxLikes = post.likes
      favoritePost = post
    }
  })

  return favoritePost
}

const mostBlogs = (blogs) => {
  const blogsByAuthor = lodash.groupBy(blogs, 'author')

  let maxBlogs = 0
  let mostProductiveAuthor = {}

  lodash.forEach(blogsByAuthor, authorPost => {
    if (authorPost.length >= maxBlogs) {
      maxBlogs = authorPost.length
      mostProductiveAuthor = {
        author: authorPost[0].author, blogs: maxBlogs
      }
    }
  })

  return mostProductiveAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}

