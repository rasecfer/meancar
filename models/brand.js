const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  country: String,
  date: {type: Date, default: Date.now}
})

module.exports = mongoose.model('brand', brandSchema)