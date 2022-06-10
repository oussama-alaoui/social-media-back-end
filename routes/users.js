const router = require('express').Router();
const bcrypt = require('bcrypt');

// models
const User = require('../models/user');

// update user
router.put('/:id', async (req, res) => {
    if (req.params.id === req.body.userId || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(req.body.password, salt);
                req.body.password = hash;
            } catch (err) {
                return res.status(404).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});
            res.status(200).json("User updated");
        } catch (err) {
            res.status(404).json(err);
        }
    } else {
        res.status(401).json("Unauthorized");
    }
});

// delete userId
router.delete('/:id', async (req, res) => {
    if (req.params.id === req.body.userId || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            
            res.status(200).json("User deleted");
        } catch (err) {
            res.status(404).json(err);
        }
    } else {
        res.status(401).json("You can only delete your own account");
    } 
});

// get user
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, updateAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(404).json(err);
    }
});

// follow user
router.put('/:id/follow', async (req, res) => {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await User.findById(req.params.id);
            const current = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                res.status(403).json("You are already following this user");
            }
            else {
                user.followers.push(req.body.userId);
                current.following.push(req.params.id);
                await user.save();
                await current.save();
                res.status(200).json("User followed");
            }
        } catch (err) {
            res.status(404).json(err);
        }
    } else
        res.status(401).json("You can't follow yourself");
});

// unfollow user
router.put('/:id/unfollow', async (req, res) => {
    if (req.params.id !== req.body.userId) {
        try {
            const user = await User.findById(req.params.id);
            const current = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                user.followers.pull(req.body.userId);
                current.following.pull(req.params.id);
                await user.save();
                await current.save();
                res.status(200).json("User unfollowed");
            }
            else {
                res.status(403).json("You are already unfollowing this user");
            }
        } catch (err) {
            res.status(404).json(err);
        }
    } else
        res.status(401).json("You can't unfollow yourself");
});

module.exports = router;