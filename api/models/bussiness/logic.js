const Bussines = require('./index')
const UserLogic = require('../user/logic')

logic = {

    getBussiness() {
        return Bussines.find({}).select('-__v').lean()
            .then(bussinesses => {
                bussinesses.forEach(bussiness => {
                    bussiness.id = bussiness._id.toString()
                    delete bussiness._id
                })
                return bussinesses
            })
    },

    getBussinessById(bussinessId) {
        return Bussines.findById(bussinessId).select('-__v').lean()
            .then(bussiness => {
                bussiness.id = bussiness._id
                delete bussiness._id
                return bussiness
            })
    },

    createBussiness(creatorId, creatorRole, data) {
        if (!data.owner) {
            throw Error("Owner is needed")
        }

        if (data.owner !== creatorId) {
            if (creatorRole !== "admin") {
                throw Error("Insuficcient Permisions")
            } else {
                let bussiness = new Bussines({ ...data })
                return bussiness.save()
                    .then(bussiness => {
                        return UserLogic.addMyBussiness(data.owner, bussiness._id)
                            .then(() => {
                                return Bussines.findById(bussiness._id).select('-__v').lean()
                                    .then(bussiness => {
                                        bussiness.id = bussiness._id
                                        delete bussiness._id
                                        return bussiness
                                    })
                            })
                            .catch(({ message }) => {
                                throw Error(message)
                            })
                    })
            }
        } else {
            if (creatorRole == "editor") {
                let bussiness = new Bussines({ ...data })
                return bussiness.save()
                    .then(bussiness => {
                        return Bussines.findById(bussiness._id).select('-__v').lean()
                            .then(bussiness => {
                                bussiness.id = bussiness._id
                                delete bussiness._id
                                return bussiness
                            })
                    })
            } else {
                throw Error("This user can't have any bussiness")
            }
        }
    },

    editBussiness(editorId, editorRole, bussinessId, data) {
        return Bussines.findById(bussinessId)
            .then(bussiness => {
                if (bussiness.owner.toString() !== editorId) {
                    if (editorRole == "admin") {
                        return Bussines.update(data)
                            .then(bussiness => {
                                return Bussines.findById(bussinessId).select('-__v').lean()
                                    .then(bussiness => {
                                        bussiness.id = bussiness._id
                                        delete bussiness._id
                                        return bussiness
                                    })
                            })
                    } else {
                        throw Error("Insufficient permisions")
                    }
                } else {
                    return Bussines.update(data)
                        .then(bussiness => {
                            return Bussines.findById(bussinessId).select('-__v').lean()
                                .then(bussiness => {
                                    bussiness.id = bussiness._id
                                    delete bussiness._id
                                    return bussiness
                                })
                        })
                }
            })
    }

}

module.exports = logic
