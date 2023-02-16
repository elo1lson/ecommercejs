const router = require('express').Router();
const Cryptojs = require('crypto-js');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post('/register', async (req, res) => {
    console.log(req.body);
    if (!req.body) {
        return res.status(400).json({ error: 'Missing body' });
    }
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({
            email,
            username,
            password: Cryptojs.AES.encrypt(
                password,
                process.env.SECRET_KEY
            ).toString(),
        });
        user.save();
        return res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ error: 'Missing body' });
    }
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const user = await User.findOne({ username });
        const hashedPassword = Cryptojs.AES.decrypt(
            user.password,
            process.env.SECRET_KEY
        ).toString(Cryptojs.enc.Utf8);

        if (password !== hashedPassword) {
            return res.status(400).json({ error: 'Incorrect password' });
        }
        user.password = undefined;

        const acessToken = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: '10d' }
        );

        return res.json({
            user,
            acessToken,
        });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Login failed' });
    }
});
module.exports = router;
