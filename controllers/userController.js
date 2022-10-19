const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { json } = require('express')

// @desc Get all users
// @route GET /user
// @access Private
const getUsers = asyncHandler(async (req, res) => {
  console.log('in getUsers')
  const users = await User.find().select('-password').lean()
  console.log(`got users: ${JSON.stringify(users)}`)

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" })
  }

  return res.json(users)
})

// @desc Create user
// @route POST /user
// @access Private
const createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body

  // Validate data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: `Duplicate username` })
  }

  // TODO - move salt rounds to configuration file
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10) // salt rounds

  // add new user
  const newUser = { username, password: hashedPassword, roles }
  const user = await User.create(newUser)

  if (user) {
    return res.status(201).json({ message: `New user ${username} created` })
  } else {
    return res.status(400).json({ message: 'Invalid user data received' })
  }
})

// @desc Update user
// @route PATCH /user
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body

  // Validate data
  if (!id || !username || !roles || Array.isArray(roles) || typeof active !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const duplicate = await User.findOne({ username }).lean().exec()
  // Allow updates to the oryginal user
  if (duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' })
  }

  user.username = username
  user.roles = roles
  user.active = active

  if (password) {
    // TODO - move salt rounds to configuration file
    user.password = bcrypt.hash(password, 10) // salt rounds
  }

  const updatedUser = await user.save()

  return res.status(200).json({ message: `User ${username} upadted` })
})

// @desc Delete user
// @route DELETE /user
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body

  // Validate data
  if (!id) {
    return res.status(400).json({ message: 'User id is required' })
  }

  const note = await Note.findOne({ user: id }).lean().exec()
  if (note) {
    return res.status(400).json({ message: 'User has assigned notes' })
  }

  const user = await User.findById(id).exec()
  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()
  const reply = `Username ${result.username} with ID ${result._id} deleted`

  return res.status(200).json(reply)
})

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
}
