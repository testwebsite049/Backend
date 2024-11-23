// authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../Middleware/authMiddleware');

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.loginUser);
router.get('/searchGoogleMaps', authController.searchGoogleMaps);

module.exports = router;
