const fetch = require('node-fetch');

// // Your OpenWeatherMap API key
// const apiKey = '33ad876832b59ab2a0328ebb24dc3822s';

// // Function to fetch weather data
// async function fetchWeather(city) {
//     try {
//         const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
//         if (!response.ok) {
//             throw new Error('Weather data not found');
//         }
//         const data = await response.json();
//         console.log("response data---->",data);
//         return data;
//     } catch (error) {
//         throw new Error('Error fetching weather data: ' + error.message);
//     }
// }

// module.exports = {
//     getWeather: async (req, res) => {
//         const { city } = req.params;
//         try {
//             const data = await fetchWeather(city);
//             res.json(data);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// };

// const fetch = require('node-fetch');

async function getWeather(cityName, apiKey) {
    try {
        console.log("city name===>",cityName)
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    getWeather
};
