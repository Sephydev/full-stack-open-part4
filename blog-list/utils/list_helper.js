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

module.exports = {
  dummy,
  totalLikes
}

