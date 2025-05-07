const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }],
  username: {
    type: String,
    min: 3,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    min: 3,
    required: true
  },
  name: String
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)