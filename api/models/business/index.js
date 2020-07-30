const mongoose = require('mongoose')
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')
const { Schema, ObjectId } = mongoose

const Business = new Schema({

    owner: {
        type: ObjectId,
        ref: 'User',
        required: true
    },

    info: {
        email: {
            type: String
        },

        phone: {
            type: String
        },

        instagram: {
            type: String
        },

        twitter: {
            type: String
        },

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

    isEnabled: {
        type: Boolean,
        required: true,
        default: false
    },

    isPublished: {
        type: Boolean,
        required: true,
        default: true
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

    mainImage: {
        type: ObjectId,
        ref:"File"
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
        },

        paymentMethodId: {
            type: String
        },

        last4: {
            type: String
        },

        lastPayment: {
            type: String
        }
    }
})

Business.index({ location: "2dsphere" })
Business.plugin(aggregatePaginate)

module.exports = mongoose.model("Business", Business)
