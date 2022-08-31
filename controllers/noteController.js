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
        return res.status(400).json({ message: 'No notes found' })
    }

    // Append username to each note
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})

// @desc Create new note
// @route POST /note
// @access Private
const createNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    // Validate data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const duplicate = await Note.findOne({ user, title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' })
    }

    const noteObject = {
        user,
        title,
        text
    }

    const note = await Note.create(noteObject)

    if (note) {
        return res.status(201).json({ message: `New note '${title}' created` })
    } else {
        return res.status(400).json({ message: 'Invalid note data' })
    }
})

// @desc Update a note
// @route PATCH /note
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const duplicate = await Note.findOne({ title }).lean().exec()
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed

    const updatedNote = await note.save()

    res.json({ message: `Note '${note.title}' updated` })
})

// @desc Delete a note
// @route DELETE /note
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'Note ID is required' })
    }

    /// TODO - check user role (only Manager and Admins can delete notes)
    const note = await Note.findById(id).exec()
    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json({ reply })
})

module.exports = {
    getNote,
    createNote,
    updateNote,
    deleteNote
}