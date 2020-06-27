const Busines = require('./index')
const FileLogic = require('../file/logic')
const UserLogic = require('../user/logic')

logic = {

    getBusiness() {
        return Busines.find({}).select('-__v').lean()
            .then(businesses => {
                businesses.forEach(business => {
                    business.id = business._id.toString()
                    delete business._id
                })
                return businesses
            })
    },

    getBusinessById(businessId) {
        return Busines.findById(businessId).select('-__v').lean()
            .then(business => {
                business.id = business._id
                delete business._id
                return business
            })
    },

    createBusiness(creatorId, creatorRole, data) {
        const  {attachments, owner} = data

        if (!owner) {
            throw Error("Owner is needed")
        }

        if (owner !== creatorId) {
            if (creatorRole !== "admin") {
                throw Error("Insuficcient Permisions")
            } else {
                let business = new Busines({ ...data })
                return business.save()
                    .then(business => {
                        return UserLogic.addMyBusiness(owner, business._id)
                            .then(() => {
                                return Busines.findById(business._id).select('-__v').lean()
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
                let business = new Busines({ ...data })
                return business.save()
                    .then(business => {
                        return Busines.findById(business._id).select('-__v').lean()
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
        return Busines.findById(businessId)
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
                                return Busines.findById(businessId).select('-__v').lean()
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
                            return Busines.findById(businessId).select('-__v').lean()
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
