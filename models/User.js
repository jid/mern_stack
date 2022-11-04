// import { Document, Schema, model } from 'mongoose'
const mongoose = require('mongoose')

// export interface IUser extends Document {
//   username: string
//   password: string
//   roles: string[]
//   active: boolean
// }

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    default: ['Employee']
  },
  active: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model('User', userSchema)