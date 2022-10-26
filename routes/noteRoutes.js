// import { IRouter, IRouterMatcher } from 'express'
const express = require('express')
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController')
const verifyJWT = require('../middleware/verifyJWT')

const router = express.Router()

router.use(verifyJWT)

router.route('/')
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote)

module.exports = router
