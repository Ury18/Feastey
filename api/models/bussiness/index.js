const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose

const Bussiness = new Schema({
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

    menus: [{
        type: ObjectId,
        ref: 'File'
    }]
})

module.exports = mongoose.model("Bussiness", Bussiness)
