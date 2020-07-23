const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
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

    summary: {
        type: String
    },

    address: {
        type: String,
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    images: [{
        type: ObjectId,
        ref: 'File'
    }],

    qr_codes: [{
        type: ObjectId,
        ref: 'File'
    }],

    attachments: [{
        name: {
            type: String,
            required: true
        },

        files: [{
            type: ObjectId,
            ref: 'File'
        }]
    }],

    category: {
        type: ObjectId,
        ref: 'Category',
        required: true
    },

    stripe: {
        customerId: {
            type: String
        },

        subscriptionId: {
            type: String
        },

        productId: {
            type: String
        },

        priceId: {
            type: String
        }
    }
})

Business.index({ location: "2dsphere" })
Business.plugin(aggregatePaginate)
module.exports = mongoose.model("Business", Business)
