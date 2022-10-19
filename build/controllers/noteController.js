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
// @desc Get all notes
// @route GET /note
// @access Private
const getNote = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield Note.find().lean();
    if (!(notes === null || notes === void 0 ? void 0 : notes.length)) {
        return res.status(400).json({ message: 'No notes found' });
    }
    // Append username to each note
    const notesWithUser = yield Promise.all(notes.map((note) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User.findById(note.user).exec();
        return Object.assign(Object.assign({}, note), { username: user.username });
    })));
    res.json(notesWithUser);
}));
// @desc Create new note
// @route POST /note
// @access Private
const createNote = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, title, text } = req.body;
    // Validate data
    if (!user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const duplicate = yield Note.findOne({ user, title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate title' });
    }
    const noteObject = {
        user,
        title,
        text
    };
    const note = yield Note.create(noteObject);
    if (note) {
        return res.status(201).json({ message: `New note '${title}' created` });
    }
    else {
        return res.status(400).json({ message: 'Invalid note data' });
    }
}));
// @desc Update a note
// @route PATCH /note
// @access Private
const updateNote = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user, title, text, completed } = req.body;
    if (!id || !user || !title || !text) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const note = yield Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }
    const duplicate = yield Note.findOne({ title }).lean().exec();
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        return res.status(409).json({ message: 'Duplicate title' });
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = yield note.save();
    res.json({ message: `Note '${note.title}' updated` });
}));
// @desc Delete a note
// @route DELETE /note
// @access Private
const deleteNote = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Note ID is required' });
    }
    /// TODO - check user role (only Manager and Admins can delete notes)
    const note = yield Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'Note not found' });
    }
    const result = yield note.deleteOne();
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;
    res.json({ reply });
}));
module.exports = {
    getNote,
    createNote,
    updateNote,
    deleteNote
};
