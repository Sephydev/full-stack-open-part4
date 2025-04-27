const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    console.log(response.status)
    response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}