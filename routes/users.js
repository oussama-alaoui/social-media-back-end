const router = require('express').Router();
const bcrypt = require('bcrypt');

// models
const User = require('../models/user');

// update user
router.put('/:id', async (req, res) => {
    if (req.params.id === req.body.id || req.user.isAdmin) {
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


// create a new user

// get user

// follow user

// unfollow user


module.exports = router;