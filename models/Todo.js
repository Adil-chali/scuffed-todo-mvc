const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  picture: {
    type: String,
  },
  deletePicture: {
    type:String,
  }
})

module.exports = mongoose.model('Todo', TodoSchema)
