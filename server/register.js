const express = require('express');
const router = express.Router();
const User = require('../models/User'); // The MongoDB database objects
const bcryptjs = require('bcryptjs');
const { registerValidation } = require('./validations/validation');


router.post('/', async (req, res) => {
    console.log(req.body);

    // Validation 1 to check user input
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    // Validation 2 to check if user already exists
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).send({ message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
        return res.status(400).send({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    // Create a new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).send({ message: 'User registered successfully!', userId: savedUser._id });
    } catch (err) {
        res.status(400).send({ message: 'Error registering user: ' + err.message });
    }
});

module.exports = router;
