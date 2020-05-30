const mongoose = require('mongoose')
const { Schema, ObjectId }  = mongoose

const User = new Schema({
    username: {
        type: String,
        required: true
    },

    // email: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     validate: {
    //         validator: email => {
    //             return /^\w+([\.-]?\w+)+@\w+([\.:]?\w+)+(\.[a-zA-Z0-9]{2,3})+$/.test(email);
    //         },
    //         message: props => `${props.value} is not a valid email`
    //     }
    // },

    // password: {
    //     type: String,
    //     required: true
    // },

    // role: {
    //     type: String
    // }

})

module.exports = mongoose.model("User", User)
