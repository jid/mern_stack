"use strict";
const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
router.route('/')
    .get(getUsers)
    .post(createUser)
    .patch(updateUser)
    .delete(deleteUser);
module.exports = router;
