const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isCustomer: Boolean,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean,
  role: String,
  date: {type: Date, default: Date.now}
})

userSchema.methods.generateJWT = function() {
  return jwt.sign({
          _id: this._id,
          name: this.name,
          role: this.role,
          isAdmin: this.isAdmin
        }, process.env.SECRET_KEY_API_CARSDB)
}

module.exports = mongoose.model('user', userSchema)