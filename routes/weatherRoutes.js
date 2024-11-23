// const express = require('express');
// const weatherController = require('../controllers/weatherController');
// const router = express.Router();


// // Define routes
// router.get('/weather/:city', weatherController.getWeather);

// module.exports = router;

const express = require('express');
const { getWeather } = require('../controllers/weatherController');
const router = express.Router();
// const { getWeather } = require('./weatherController');

// Define routes
router.get('/weather/:city', async (req, res) => {
    const cityName = req.params.city;
    const apiKey = '41a4bd73b6392dd3f4055663fdcdc24f'; 
    
    try {
        const weatherData = await getWeather(cityName, apiKey);
        res.json(weatherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
