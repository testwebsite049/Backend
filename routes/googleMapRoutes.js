const express = require('express');
const { searchGoogleMaps } = require('../controllers/googleController');


const router = express.Router();

router.get('/search', searchGoogleMaps);

module.exports = router;
