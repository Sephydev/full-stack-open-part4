const logger = (request, response, next) => {
  console.log('METHOD:', request.method)
  console.log('PATH:', request.path)
  console.log('BODY:', request.path)
  console.log('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'ValidationError') {
    console.log(response.status)
    response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  logger,
  unknownEndpoint,
  errorHandler
}