const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const User = require('../models/User'); // This is correct

require('dotenv').config({ path: './config/.env' }); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public'))); // Updated path

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

// Define the root route to serve the login.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Updated path
});
// Define a specific route for /index if needed
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Serve the same welcome page
});


// Import routes
const filmsRoute = require('../routes/films');
const authRoute = require('../routes/auth');  // Existing auth route
const registerRoute = require('./register');   // New register route
const loginRoute = require('./login');         // New login route

// Use routes
app.use('/api/film', filmsRoute);
app.use('/api/auth', authRoute);  // Keep the existing auth route if needed
app.use('/register', registerRoute);  // Use the new register route
app.use('/login', loginRoute);        // Use the new login route

// Test route for verifying API is working
app.get('/api/user/test', (req, res) => {
    res.send('Test route is working!');
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Export the app instance for testing or further usage
module.exports = app;
