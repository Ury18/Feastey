const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose

const Business = new Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: String,
    },

    location: {
        type: String,
        required: true
    },

    images: [{
        type: ObjectId,
        ref: 'File'
    }],

    attachments : [{
        name: {
            type: String,
            required: true
        },

        files: [{
            type: ObjectId,
            ref: 'File'
        }]
    }]
})

module.exports = mongoose.model("Business", Business)
