require('dotenv').config();
// server.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/UserRoutes');
const sequelize = require('./config/database');
const cors = require('cors');
const weather = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json()); 
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api',weather);
app.use('/api/user', userRoutes)

const routes = require('./routes');
app.use(routes);

// Connect to the database and start the server
sequelize.sync().then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
