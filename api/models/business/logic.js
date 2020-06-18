const Busines = require('./index')
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
        if (!data.owner) {
            throw Error("Owner is needed")
        }

        if (data.owner !== creatorId) {
            if (creatorRole !== "admin") {
                throw Error("Insuficcient Permisions")
            } else {
                let business = new Busines({ ...data })
                return business.save()
                    .then(business => {
                        return UserLogic.addMyBusiness(data.owner, business._id)
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
                        return Busines.update(data)
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
                    return Busines.update(data)
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
