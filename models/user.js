const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
            type: String,
            required: true,
            min: 3,
            max: 25,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 255
        },
        password: {
            type: String,
            required: true,
            min: 5,
            max: 20,
        },
        profile_picture: {
            type: String,
            default: ""
        },
        followers: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps : true}
);

module.exports = mongoose.model('User', userSchema);