const Business = require('./index')
const UserLogic = require('../user/logic')
const FileLogic = require('../file/logic')
const qrHelper = require('../../middleware/qr-helper')
const stripeHelper = require('../../middleware/stripe-helper')
const fs = require('fs')
const { Types: { ObjectId } } = require('mongoose')
const NODE_PATH = process.env.NODE_PATH

logic = {

    getBusiness() {
        return Business.find({}).select('-__v').lean()
            .then(businesses => {
                businesses.forEach(business => {
                    business.id = business._id.toString()
                    delete business._id
                })
                return businesses
            })
    },

    getBusinessById(businessId) {
        return Business.findById(businessId).populate("images").populate("attachments.files").populate("qr_codes").populate("category").populate("mainImage").select('-__v').lean()
            .then(business => {
                business.id = business._id
                delete business._id

                business.images.forEach(image => {
                    image.id = image._id
                    delete image._id
                    delete image.__v
                })

                business.qr_codes.forEach(qr => {
                    qr.id = qr._id
                    delete qr._id
                    delete qr.__v
                })

                business.attachments.forEach(attachment => {
                    attachment.id = attachment._id
                    delete attachment._id
                    delete attachment.__v

                    attachment.files.forEach(file => {
                        file.id = file._id
                        delete file._id
                        delete file.__v
                    })
                })

                business.category.id = business.category._id
                delete business.category._id
                delete business.category.__v

                if (business.mainImage) {
                    business.mainImage.id = business.mainImage._id
                    delete business.mainImage._id
                    delete business.mainImage.__v
                }

                return business
            })
    },

    getBusinessByDistance(data) {
        let { location, distance, page, count, category, name } = data
        let filters = []
        filters.push(
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [parseFloat(location[0]), parseFloat(location[1])]
                    },
                    distanceField: "dist",
                    maxDistance: distance * 1000,
                    distanceMultiplier: 1 / 1000,
                    spherical: true
                }
            }
        )

        filters.push(
            {
                $lookup: { from: 'files', localField: "images", foreignField: "_id", as: "images" }
            }
        )
        filters.push(
            {
                $lookup: { from: 'files', localField: "mainImage", foreignField: "_id", as: "mainImage" }
            }
        )
        filters.push(
            {
                $lookup: { from: 'categories', localField: "category", foreignField: "_id", as: "category" }
            }
        )

        if (category) {
            filters.push(
                {
                    $match: {
                        category: ObjectId(category)
                    }
                }
            )
        }
        if (name) {
            filters.push(
                {
                    $match: {
                        name: { "$regex": name, "$options": "i" }
                    }
                }
            )
        }

        const aggregate = Business.aggregate(filters)

        if (!page) page = 1
        if (!count) count = 1

        const options = {
            page: page,
            limit: count
        }
        return Business.aggregatePaginate(aggregate, options)
            .then((businesses) => {
                businesses = businesses.docs
                businesses.forEach(business => {
                    business.id = business._id
                    business.category = business.category[0]
                    if (business.mainImage && business.mainImage.length > 0) {
                        business.mainImage = business.mainImage[0]
                    } else {
                        delete business.mainImage
                    }
                    if(business.images.length > 0) {
                        business.images.forEach(element => {
                            element.id = element._id
                            delete element._id
                            delete element.__v
                        })
                    }
                    delete business._id
                    delete business.__v
                })

                return businesses
            })

    },

    async getMultipleBusinesses(businessesIds) {
        let businessList = await Business.find().populate("images").populate("mainImage").populate("category").select('-__v').lean().where('_id').in(businessesIds).exec()
        businessList.forEach(business => {
            business.id = business._id
            delete business._id

            if(business.mainImage) {
                business.mainImage.id = business.mainImage._id
                delete business.mainImage._id
                delete business.mainImage.__v
            }

            if(business.images.length > 0) {
                business.images.forEach(element => {
                    element.id = element._id
                    delete element._id
                    delete element.__v
                })
            }

            business.category.id = business.category._id
            delete business.category._id
            delete business.category.__v

        })
        return businessList
    },

    createBusiness(creatorId, creatorRole, data) {
        const { attachments, owner } = data

        if (!owner) {
            throw Error("Owner is needed")
        }

        if (creatorRole !== "admin") {
            if (!data.paymentMethodId) throw Error("Please introduce a valid payment method")
            if (!data.priceId) throw Error("Please select a price")
        }

        const create = () => {
            let business = new Business({ ...data })
            return business.save()
                .then(business => {
                    return UserLogic.addMyBusiness(owner, business._id)
                        .then(() => {
                            return this.generateBusinessQrById(business._id, owner)
                                .then(async (file) => {
                                    business.qr_codes.push(file.id)
                                    let stripeCustomer = await stripeHelper.createSubscriber(data.ownerEmail)
                                    business.stripe.customerId = stripeCustomer.id
                                    let stripeSubscription = await stripeHelper.createSubscription(stripeCustomer.id, data.paymentMethodId, data.priceId)
                                    if (stripeSubscription.error) {
                                        stripeHelper.deleteSubscriber(stripeCustomer.id)
                                        throw Error(stripeSubscription.error)
                                    }
                                    if (stripeSubscription.latest_invoice.payment_intent.status !== 'succeeded') {
                                        stripeHelper.deleteSubscriber(stripeCustomer.id)
                                        throw Error("No se ha podido completar el pago, porfavor, introduce otro metodo de pago.")
                                    }


                                    let paymentInfo = await stripeHelper.retrivePaymentInfo(data.paymentMethodId)

                                    business.stripe.lastPayment = "success"
                                    business.stripe.last4 = paymentInfo.card.last4
                                    business.stripe.subscriptionId = stripeSubscription.id
                                    business.stripe.priceId = data.priceId
                                    business.stripe.productId = stripeSubscription.plan.product
                                    business.stripe.paymentMethodId = data.paymentMethodId
                                    business.isEnabled = true
                                    return business.save()
                                        .then(() => {
                                            return Business.findById(business._id).select('-__v').lean()
                                                .then(business => {
                                                    business.id = business._id
                                                    delete business._id
                                                    return business
                                                })
                                        })
                                })
                        })
                        .catch(({ message }) => {
                            return Business.findByIdAndRemove(business._id)
                                .then(() => {
                                    throw Error(message)
                                })
                        })
                })
        }

        if (owner !== creatorId) {
            if (creatorRole !== "admin") {
                throw Error("Insuficcient Permisions")
            } else {
                return create()
            }
        } else {
            if (creatorRole == "businessOwner") {
                return create()
            } else {
                throw Error("This user can't have any business")
            }
        }
    },

    generateBusinessQrById(businessId, owner) {
        return qrHelper.generateQr(businessId)
            .then(() => {
                return qrHelper.mergeQr(businessId)
                    .then(() => {
                        let file = {
                            mimetype: "image/png",
                            buffer: {}
                        }
                        let data = {
                            owner: owner,
                            name: `finalQR-${businessId}`,
                        }
                        return new Promise((resolve, reject) => {

                            fs.readFile(`${NODE_PATH}/public/tmp/qr/finalQR-${businessId}.png`, function (err, buffer) {
                                if (err) console.log(err)
                                file.buffer = buffer
                                resolve(FileLogic.uploadFile(owner, "businessOwner", data, file))
                            })
                        })
                            .then(file => {
                                return new Promise((resolve, reject) => {
                                    fs.unlink(`${NODE_PATH}/public/tmp/qr/finalQR-${businessId}.png`, function (err) {
                                        resolve(file)
                                    })
                                })
                            })
                    })
            })
    },

    editBusiness(editorId, editorRole, businessId, data) {
        const edit = async (business) => {
            let { paymentMethodId, priceId } = data
            if (data.priceId) delete data.priceId
            if (data.paymentMethodId) delete data.paymentMethodId

            if (business.stripe.paymentMethodId !== paymentMethodId) {
                let customer = await stripeHelper.changePaymentMethod(business.stripe.customerId, business.stripe.paymentMethodId, paymentMethodId)

                if (customer.invoice_settings.default_payment_method == paymentMethodId) {
                    business.stripe.paymentMethodId = paymentMethodId
                    const paymentInfo = await stripeHelper.retrivePaymentInfo(paymentMethodId)
                    business.stripe.last4 = paymentInfo.card.last4

                    if (business.stripe.lastPayment == "failed") {
                        let canceledSubscription = await stripeHelper.cancelSubscription(business.stripe.subscriptionId)
                        let stripeSubscription = await stripeHelper.createSubscription(business.stripe.customerId, paymentMethodId, priceId)

                        if (stripeSubscription.latest_invoice.payment_intent.status !== 'succeeded') {
                            throw Error("No se ha podido completar el pago, porfavor, introduce otro metodo de pago.")
                        } else {
                            business.stripe.lastPayment = "success"
                            business.isEnabled = true
                            business.stripe.subscriptionId = stripeSubscription.id
                            business.stripe.productId = stripeSubscription.plan.product
                            PaymentSucceeded.send({ to: business.user.email, business })
                        }
                    }
                }
            }

            if (business.stripe.priceId !== priceId) {
                let stripePlan = await stripeHelper.changeSubscriptionPrice(business.stripe.subscriptionId, priceId)
                if (stripePlan.plan.id == priceId) {
                    business.stripe.priceId = priceId
                }
            }

            var keys = Object.keys(data)

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i]
                business[key] = data[key]
            }

            return business.save()
                .then(business => {
                    return Business.findById(businessId).select('-__v').lean()
                        .then(business => {
                            business.id = business._id
                            delete business._id
                            return business
                        })
                })
        }

        return Business.findById(businessId).populate("owner")
            .then(business => {
                if (business.owner._id.toString() !== editorId) {
                    if (editorRole == "admin") {
                        return edit(business)
                    } else {
                        throw Error("Insufficient permisions")
                    }
                } else {
                    return edit(business)
                }
            })
    },

    onPaymentFailed(data) {
        if (data.type == "invoice.payment_failed") {
            return Business.findOne({ "stripe.subscriptionId": data.data.object.subscription }).populate("owner")
                .then(business => {
                    if (business) {
                        if (!business.isEnabled) return "Nothing to do"
                        business.isEnabled = false
                        business.stripe.lastPayment = "failed"
                        PaymentFailed.send({ to: user.email, business })
                        return business.save()
                            .then(business => {
                                return "Business disabled"
                            })
                    } else {
                        throw Error("Business not found")
                    }
                })
        }
    },

    onPaymentSuccess(data) {
        if (data.type == "invoice.payment_succeeded") {
            return Business.findOne({ "stripe.subscriptionId": data.data.object.subscription }).populate("owner")
                .then(business => {
                    if (business) {
                        if (business.isEnabled) return "Nothing to do"
                        business.isEnabled = true
                        business.stripe.lastPayment = "success"
                        PaymentSucceeded.send({ to: user.email, business})
                        return business.save()
                            .then(business => {
                                return "Business enabled"
                            })
                    } else {
                        throw Error("Business not found")
                    }
                })
        }
    }

}

module.exports = logic
