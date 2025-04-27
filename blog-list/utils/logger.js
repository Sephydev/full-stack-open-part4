const logger = (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('METHOD:', request.method)
    console.log('PATH:', request.path)
    console.log('BODY:', request.body)
    console.log('---')
  }

  next()
}

module.exports = logger