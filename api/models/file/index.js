const mongoose = require('mongoose')
const { Schema } = mongoose

const File = new Schema({
    name: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true,
        enum: ["pdf","img"]
    }
})

module.exports = mongoose.model("File", File)
