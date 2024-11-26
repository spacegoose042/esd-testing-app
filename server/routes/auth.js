const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Routes now just point to controller methods
router.post('/login', authController.login);
router.post('/register', auth, authController.register);
router.get('/verify', auth, authController.verify);

module.exports = router;