const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

const userRoutes = require('./UserRoutes');

const googleMapRoutes = require('./googleMapRoutes');

router.use('/api/auth', authRoutes);

router.use('/api/user', userRoutes);

router.use('/api/map', googleMapRoutes)

module.exports = router;