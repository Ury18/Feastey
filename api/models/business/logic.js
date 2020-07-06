const Business = require('./index')
const FileLogic = require('../file/logic')
const UserLogic = require('../user/logic')

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
        return Business.findById(businessId).populate("images").populate("attachments.files").select('-__v').lean()
            .then(business => {
                business.id = business._id
                delete business._id

                business.images.forEach(image => {
                    image.id = image._id
                    delete image.__v
                    delete image._id
                })

                business.attachments.forEach(attachment => {
                    attachment.id = attachment._id
                    delete attachment.__v
                    delete attachment._id

                    attachment.files.forEach(file => {
                        file.id = file._id
                        delete file.__v
                        delete file._id
                    })
                })

                return business
            })
    },

    getBusinessByDistance(data) {
        const { location, distance } = data
        return Business.createIndexes({ location: { location: "2dsphere" } })

            .then(() => {

                return Business.aggregate([
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: location },
                            distanceField: "distance",
                            maxDistance: distance,
                            spherical: true
                        }
                    }
                ])
                    .then((businesses) => {
                        return businesses
                    })
            })

    },

    createBusiness(creatorId, creatorRole, data) {
        const { attachments, owner } = data

        if (!owner) {
            throw Error("Owner is needed")
        }

        if (owner !== creatorId) {
            if (creatorRole !== "admin") {
                throw Error("Insuficcient Permisions")
            } else {
                let business = new Business({ ...data })
                return business.save()
                    .then(business => {
                        return UserLogic.addMyBusiness(owner, business._id)
                            .then(() => {
                                return Business.findById(business._id).select('-__v').lean()
                                    .then(business => {
                                        business.id = business._id
                                        delete business._id
                                        return business
                                    })
                            })
                            .catch(({ message }) => {
                                throw Error(message)
                            })
                    })
            }
        } else {
            if (creatorRole == "businessOwner") {
                let business = new Business({ ...data })
                return business.save()
                    .then(business => {
                        return Business.findById(business._id).select('-__v').lean()
                            .then(business => {
                                business.id = business._id
                                delete business._id
                                return business
                            })
                    })
            } else {
                throw Error("This user can't have any business")
            }
        }
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
