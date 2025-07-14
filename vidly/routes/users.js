const auth = require('../middleware/auth');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const validate = require('../middleware/validate');

router.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
})

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', validate(validateUser), async (req, res) => {
    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already registered...');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.set('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

module.exports = router;