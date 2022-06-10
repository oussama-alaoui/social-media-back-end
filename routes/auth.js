const router = require('express').Router();
const bcrypt = require('bcrypt');

// models
const User = require('../models/user');

// register
router.post('/register', async (req, res) => {
    try {
        // hashpassword
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(req.body.password, salt);

        // create a new user
        const user = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword,
        })

        // save user to database
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
});

// login
router.post('/login', async (req, res) => {
    try {
        // find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
           return res.status(400).json({ msg: 'User not found' });
        }
        else {
            // check if password is correct
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Password not found' });
            }
            else {
                // return jsonwebtoken
                return res.json({ msg: 'Success' });
            }
        }
    }
    catch (error) {
        return res.status(500).json(error);
    }
});


// GET /api/users
router.get('/', (req, res) => {
    res.send('GET /api/users');
});


module.exports = router;