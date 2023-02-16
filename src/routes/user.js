const router = require('express').Router();
const CryptoJS = require('crypto-js');
const User = require('../models/User');
const {
    verifyTokenAndAdmin,
    verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.JWT_KEY,
        ).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );

        return res.status(200).json({
            message: 'User updated successfully',
            updatedUser,
        });
    } catch (e) {
        return res.status(400).send({
            error: 'Error updating user',
        });
    }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (e) {
        return res.status(400).send({
            error: 'Error deleting user',
        });
    }
});

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        return res.status(200).json({ user });
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            error: 'You are not alowed to that',
        });
    }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();

        return res.status(200).json({ users });
    } catch (e) {
        return res.status(400).send({
            error: 'You are not alowed to that',
        });
    }
});

// GET user stats

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: {
                        $month: '$createdAt',
                    },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);

        return res.status(200).json(data);
    } catch (e) {
        return req.status(500).json({
            error: 'Error getting stats',
        });
    }
});
module.exports = router;
