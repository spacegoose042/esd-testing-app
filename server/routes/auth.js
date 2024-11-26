const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const pool = require('../db');

// Login route
router.post('/login', authController.login);

module.exports = router;