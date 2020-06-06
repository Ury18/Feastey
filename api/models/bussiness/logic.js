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

    createBussiness(creatorId, data) {
        if (!data.owner) {
            throw Error("Owner is needed")
        }

        if (data.owner !== creatorId) {
            return UserLogic.getUserById(creatorId)
                .then(user => {
                    if (user.role !== "admin") {
                        throw Error("Insuficcient Permisions")
                    } else {
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
                    }
                })
                .catch(({ message }) => {
                    if (message == "Insuficcient Permisions") {
                        throw Error(message)
                    } else {
                        throw Error("Creator user not found")
                    }
                })
        } else {
            return UserLogic.getUserById(data.owner)
                .then(user => {
                    if (user.role == "editor") {
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
                })
                .catch(() => {
                    throw Error("User not found")
                })
        }
    }

}

module.exports = logic
