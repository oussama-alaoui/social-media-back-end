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
        description: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            max: 25,
        },
        from: {
            type: String,
            max: 25
        },
        relationship_status: {
            type: Number,
            enum: [0, 1, 2],
        }
    },
    {timestamps : true}
);

module.exports = mongoose.model('User', userSchema);