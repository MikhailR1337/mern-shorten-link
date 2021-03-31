const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult }  = require('express-validator');
const User = require('../models/User');
const router = Router();
const JWTSECRET = config.get('jwtSecret');


router.post(
    '/register',
    [
        check('email', 'invalid email').isEmail(),
        check('password', 'invalid password, min length 8 symbols').isLength({ min: 6 }),
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid registration data'
            })
        }

        const { email, password } = req.body;
        
        const candidate = await User.findOne({ email });

        if (candidate) {
            return res.status(400).json({ message: "Such user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });

        await user.save();

        res.status(201).json({ message: "User created" });

    } catch (e) {
        res.status(500).json({ message: "Error, try again" })
    }
})

router.post(
    '/login',
    [
        check('email', 'use correct email').normalizeEmail().isEmail(),
        check('password', 'use correct password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'invalid data when logging in'
            })
        }

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'invalid password, try again' })
        }

        const token = jwt.sign(
            { userId: user.id },
            JWTSECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({ token, userId: user.id })

    } catch (e) {
        res.status(500).json({ message: "Error, try again" })
    }
})

module.exports = router;