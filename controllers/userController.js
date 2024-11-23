// userController.js

const User = require('../models/UserModel');

// Controller functions
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { username, email, phone, password } = req.body;
    
    try {
        const newUser = await User.create({
            username: username,
            email: email,
            phone: phone,
            password: password
        });

        res.status(201).json(newUser);
    } catch (err) {
        // Handle any errors
        res.status(400).json({ message: err.message });
    }
};
