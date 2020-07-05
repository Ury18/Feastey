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
        address: {
            type: String,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates : {
                type: [Number],
                required: true
            }
        }
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
