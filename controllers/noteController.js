const User = require('../models/User')
const Note = require('../models/Note')

// @desc GET all notes
// @route GET /note
// @access Private
const getNotes = async (req, res) => {
  const notes = await Note.find().lean()

  if (!notes.length) {
    return res.status(400).json({ message: 'No notes found' })
  }

  const notesWithUser = await Promise.all(notes.map(async (note) => {
    const user = await User.findById(note.user).exec()
    return { ...note, username: user?.username }
  }))

  return res.json(notesWithUser)
}

// // @desc create a note
// // @route POST /note
// // @access Private
const createNote = async (req, res) => {
  const { user: userId, title, text } = req.body

  // Validate data
  if (!userId || !title || !text) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const user = await User.findById(userId).lean().exec()
  if (!user) {
    return res.status(400).json({ message: 'Invalid user' })
  }

  const duplicate = await Note.findOne({ title, user: userId }).collation({ locale: 'simple', strength: 3 }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note' })
  }

  const noteObject = {
    user: userId,
    title,
    text
  }

  const note = await Note.create(noteObject)

  if (!note) {
    return res.status(400).json({ message: 'Invalid note data received' })
  }

  return res.status(201).json({ message: `Note for user ${user.username} created` })
}

// // @desc Update a note
// // @route PATCH /note
// // @access Private
const updateNote = async (req, res) => {
  const { id, user, title, text, completed } = req.body

  // validate data
  if (!id || !user || !title || !text || typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const note = await Note.findById(id).exec()
  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const duplicate = await Note.findOne({ title }).collation({ locale: 'simple', strength: 3 }).lean().exec()
  if (duplicate && duplicate._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate title' })
  }

  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  return res.status(200).json({ message: 'Note updated' })
}

// @desc Delete a note
// @route DELETE /note
// @access Private
const deleteNote = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Note not found' })
  }

  const note = await Note.findById(id).exec()
  if (!note) {
    return res.status(400).json({ message: 'Note not found' })
  }
  const result = await note.deleteOne()
  const reply = `Note '${result.title}' with ID ${result._id} deleted`

  return res.json({ message: reply })
}


module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote
}
