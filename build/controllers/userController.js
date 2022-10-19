"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { json } = require('express');
// @desc Get all users
// @route GET /user
// @access Private
const getUsers = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find().select('-password').lean();
    if (!users) {
        return res.status(400).json({ message: "No users found" });
    }
    return json(users);
}));
// @desc Create user
// @route POST /user
// @access Private
const createUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, roles } = req.body;
    const user = yield User.create(req.body);
}));
// @desc Update user
// @route PATCH /user
// @access Private
const updateUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
// @desc Delete user
// @route DELETE /user
// @access Private
const deleteUser = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
// // @desc Create new user
// // @route POST /user
// // @access Private
// const createUser = asyncHandler(async (req, res) => {
//     const { username, password, roles } = req.body
//     // Validate data
//     if (!username || !password || !Array.isArray(roles) || !roles.length) {
//         return res.status(400).json({ message: 'All fields are required' })
//     }
//     // Check for duplicates
//     const duplicate = await User.findOne({ username }).lean().exec()
//     if (duplicate) {
//         return res.status(409).json({ message: 'Duplicate username' })
//     }
//     // Hash pwd
//     const pwdHash = await bcrypt.hash(password, 10)
//     const userObject = {
//         username,
//         password: pwdHash,
//         roles,
//     }
// // Create and save new user
// const user = await User.create(userObject)
// if (user) {
//   res.status(201).json({ message: `New user ${username} created` })
// } else {
//   res.status(400).json({ message: 'Invalid user data' })
// }
// })
// // @desc Update a user
// // @route PATCH /user
// // @access Private
// const updateUser = asyncHandler(async (req, res) => {
//   const { id, username, password, roles, active } = req.body
//   // Validate data
//   if (!id || !username || !Array.isArray(roles) || !roles.length || typeof (active) !== 'boolean') {
//     return res.status(400).json({ message: 'All fields are required' })
//   }
//   const user = await User.findById(id).exec()
//   if (!user) {
//     return res.status(400).json({ message: 'User not found' })
//   }
//   // Check for duplicates
//   const duplicate = await User.findOne({ username }).lean().exec()
//   if (duplicate && duplicate?._id.toString() !== id) {
//     return res.status(409).json({ message: 'Duplicate username' })
//   }
//   // Update user
//   user.username = username
//   user.roles = roles
//   user.active = active
//   if (password) {
//     user.password = await bcrypt.hash(password, 10)
//   }
//   const updatedUser = await user.save()
//   res.json({ message: `${user.username} updated` })
// })
// // @desc Delete a user
// // @route DELETE /user
// // @access Private
// const deleteUser = asyncHandler(async (req, res) => {
//   const { id } = req.body
//   if (!id) {
//     return res.status(400).json({ message: 'User ID is required' })
//   }
//   // Check for existsing notes
//   const note = await Note.findOne({ user: id }).lean().exec()
//   if (note) {
//     return res.status(400).json({ message: 'User has assigned notes' })
//   }
//   const user = await User.findById(id).exec()
//   if (!user) {
//     res.status(400).json({ message: 'User not found' })
//   }
//   const result = await user.deleteOne()
//   const reply = `${result.username} with ID ${user._id} deleted`
//   res.json(reply)
// })
// module.exports = {
//   getUser,
//   createUser,
//   updateUser,
//   deleteUser
// }
