const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/get-users', userController.getAllUsers);
router.post('/post-users', userController.createUser);

module.exports = router;