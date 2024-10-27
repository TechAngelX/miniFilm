// server/login.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust the path as necessary
const { loginValidation } = require('./validations/validation');
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

router.post('/', async (req, res) => {
    console.log(req.body);

    // Validation 1 to check user input
    // const { error } = loginValidation(req.body);
    // if (error) {
    //     return res.status(400).send({ message: error['details'][0]['message'] });
    // }

    // Validation 2 to check if user exists!
    const user = await User.findOne({ username: req.body.username }); // Check by username
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
