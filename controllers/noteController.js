const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc Get all notes
// @route GET /note
// @access Private
const getNote = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean()
    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" })
    }

    res.json(notes)
})

// @desc Create new note
// @route POST /note
// @access Private
const createNote = asyncHandler(async (req, res) => {
    const { user, title, text, completed } = req.body

    // Validate data
    if (!user || !title || !text) {
        res.code(400).json({ message: "All fields are required" })
    }

    /// TODO - complete logic

})

// @desc Update a note
// @route PATCH /note
// @access Private
const updateNote = asyncHandler(async (req, res) => {

})

// @desc Delete a note
// @route DELETE /note
// @access Private
const deleteNote = asyncHandler(async (req, res) => {

})

module.exports = {
    getNote,
    createNote,
    updateNote,
    deleteNote
}