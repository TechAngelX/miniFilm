const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path'); // Import path module
const auth = require('../routes/auth');
require('dotenv').config({ path: './config/.env' }); // Load environment variables from .env file

const app = express(); // Initialize Express app

app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from the public directory

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

// Welcome page route protected by auth middleware
app.get('/welcome', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/welcome.html'));
});

// Define the root route to serve the login.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html')); // Updated path
});

// Import routes
const filmsRoute = require('../routes/films');
const registerRoute = require('./register');   // New register route
const loginRoute = require('./login');         // New login route

// Use routes
app.use('/api/film', filmsRoute);
app.use('/api/auth', auth);  // Keep the existing auth route
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
