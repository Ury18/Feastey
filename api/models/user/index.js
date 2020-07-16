const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema, ObjectId }  = mongoose

const User = new Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: email => {
                return /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/.test(email);
            },
            message: props => `${props.value} is not a valid email`
        }
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum:["user","businessOwner","admin"],
        default:"user"
    },

    recent: [{
        type: ObjectId,
        ref: "Business"
    }],

    liked: [{
        type: ObjectId,
        ref: "Business"
    }],

    favorites: [{
        type: ObjectId,
        ref: "Business"
    }],

    myBusinesses: [{
        type: ObjectId,
        ref: "Business"
    }],

})

User.plugin(uniqueValidator, {message: 'is already in use'})

module.exports = mongoose.model("User", User)
