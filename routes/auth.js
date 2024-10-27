const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../server/validations/validation');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

// Test route
router.get('/test', (req, res) => {
    res.send('Test route is working');
});

// Register route
router.post('/register', async (req, res) => {
    console.log(req.body);

    // Validation 1 to check user input
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // Validation 2 to check if user exists!
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        return res.status(400).send({ message: 'User already exists' });
    }

    // Create a hashed representation of the password
    const salt = await bcryptjs.genSalt(10); // Increased salt rounds for better security
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    // Code to insert data
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    console.log(req.body);

    // Validation 1 to check user input
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // Validation 2 to check if user exists!
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send({ message: 'User does not exist' });
    }

    // Validation 3 to check user password
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password);
    if (!passwordValidation) {
        return res.status(400).send({ message: 'Password is wrong' });
    }

    // Generate an auth-token
    const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ 'auth-token': token });
});

module.exports = router;
