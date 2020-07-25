const Business = require('./index')
const UserLogic = require('../user/logic')
const FileLogic = require('../file/logic')
const qrHelper = require('../../middleware/qr-helper')
const stripeHelper = require('../../middleware/stripe-helper')
const fs = require('fs')
const { Types: { ObjectId } } = require('mongoose')
const { create } = require('./index')
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
        return Business.findById(businessId).populate("images").populate("attachments.files").populate("qr_codes").select('-__v').lean()
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
                    delete business._id
                    delete business.__v
                })

                return businesses
            })

    },

    async getMultipleBusinesses(businessesIds) {
        let businessList = await Business.find().select('-__v').lean().where('_id').in(businessesIds).exec()
        businessList.forEach(business => {
            business.id = business._id
            delete business._id
        })
        return businessList
    },


    createBusiness(creatorId, creatorRole, data) {
        const { attachments, owner } = data

        if (!owner) {
            throw Error("Owner is needed")
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
                                    console.log(business.stripe)
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
                            throw Error(message)
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

                            fs.readFile(`${NODE_PATH}/static/tmp/qr/finalQR-${businessId}.png`, function (err, buffer) {
                                if (err) console.log(err)
                                file.buffer = buffer
                                resolve(FileLogic.uploadFile(owner, "businessOwner", data, file))
                            })
                        })
                            .then(file => {
                                return new Promise((resolve, reject) => {
                                    fs.unlink(`${NODE_PATH}/static/tmp/qr/finalQR-${businessId}.png`, function (err) {
                                        resolve(file)
                                    })
                                })
                            })
                    })
            })
    },

    editBusiness(editorId, editorRole, businessId, data) {
        return Business.findById(businessId)
            .then(business => {
                if (business.owner.toString() !== editorId) {
                    if (editorRole == "admin") {
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
                    } else {
                        throw Error("Insufficient permisions")
                    }
                } else {
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
            })
    }

}

module.exports = logic
