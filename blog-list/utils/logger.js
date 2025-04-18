const logger = (request, response, next) => {
  console.log('METHOD:', request.method)
  console.log('PATH:', request.path)
  console.log('BODY:', request.body)
  console.log('---')
  next()
}

module.exports = logger