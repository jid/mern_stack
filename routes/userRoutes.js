// import { IRouter, IRouterMatcher } from 'express'
const express = require('express')
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

router.route('/')
  .get(getUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router
