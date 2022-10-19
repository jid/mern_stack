// import { IRouter, IRouterMatcher } from 'express'
const express = require('express')
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController')

const router = express.Router()

router.route('/')
  .get(getNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote)

module.exports = router
