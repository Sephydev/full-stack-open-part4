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
  const authors = lodash.countBy(blogs, 'author')

  let blogPostRecord = 0
  let mostProductiveAuthor = {}

  lodash.forEach(authors, (nbOfBlogs, author) => {
    if (nbOfBlogs >= blogPostRecord) {
      blogPostRecord = nbOfBlogs
      mostProductiveAuthor = {
        author: author,
        blogs: nbOfBlogs
      }
    }
  })

  return mostProductiveAuthor
}

const mostLikes = (blogs) => {
  const authors = lodash.groupBy(blogs, 'author')

  let mostLikedAuthor = {}
  let likeRecord = 0

  lodash.forEach(authors, (blogs, author) => {
    let totalLikes = lodash.reduce(blogs, (totalLikes, blog) => { return totalLikes + blog.likes }, 0)

    if (totalLikes >= likeRecord) {
      likeRecord = totalLikes
      mostLikedAuthor = {
        author: author,
        likes: totalLikes
      }
    }
  })
  return mostLikedAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

