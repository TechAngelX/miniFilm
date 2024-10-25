const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config'); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTOR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Adjust this value as needed
})
    .then(() => {
        console.log('Your MongoDB connector is on...');
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

// Define the root route
app.get('/', (req, res) => {
    res.send('Hello, this is the root route!');
});

// Import routes
const filmsRoute = require('./routes/films');
const authRoute = require('./routes/auth');

// Use routes
app.use('/api/film', filmsRoute);
app.use('/api/user', authRoute);

// Test route for verifying API is working
app.get('/api/user/test', (req, res) => {
    res.send('Test route is working!');
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Export the app instance for testing or further usage
module.exports = app;
