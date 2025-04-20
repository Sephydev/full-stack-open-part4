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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

