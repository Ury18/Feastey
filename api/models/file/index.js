const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose

const File = new Schema({
    name: {
        type: String,
        required: true
    },

    owner: {
        type: ObjectId,
        ref:'User',
        required: true
    },

    url: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true,
        enum: ["application/pdf", "image/png", "image/jpeg"]
    },

    file_title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("File", File)
