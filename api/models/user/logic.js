const User = require('./index')
const bcrypt = require('bcrypt')

logic = {

    getUsers() {
        return User.find({}).select('-__v').lean()
            .then(users => {
                users.forEach(user => {
                    user.id = user._id.toString()
                    delete user._id
                })
                return users
            })
    },

    createUser(userData, creatorId, creatorRole) {
        if (!userData.role || !(userData.role == "admin") && userData.role !== "user" && userData.role !== "editor") {
            userData.role = "user"
        }

        let user = new User(userData)

        if (user.role == "admin") {
            if (creatorRole == "admin") {
                return bcrypt.hash(user.password, 10)
                    .then((hash) => {
                        user.password = hash
                        return user.save()
                            .then(user => {
                                return User.findById(user._id).select('-__v').lean()
                                    .then(user => {
                                        user.id = user._id
                                        delete user._id
                                        delete user.password
                                        return user
                                    })
                            })
                            .catch(({ message }) => {
                                throw Error(message)
                            })
                    })
                    .catch(({ message }) => {
                        throw Error(message)
                    })
            } else {
                return User.find({ role: "admin" }).select('-__v').lean()
                    .then((users) => {
                        if (users.length > 0) {
                            throw Error("You dont have permissions to create an admin user")
                        } else {
                            return bcrypt.hash(user.password, 10)
                                .then((hash) => {
                                    user.password = hash
                                    return user.save()
                                        .then(user => {
                                            return User.findById(user._id).select('-__v').lean()
                                                .then(user => {
                                                    user.id = user._id
                                                    delete user._id
                                                    delete user.password
                                                    return user
                                                })
                                        })
                                })
                        }
                    })
            }
        } else {
            return bcrypt.hash(user.password, 10)
                .then((hash) => {
                    user.password = hash
                    return user.save()
                        .then(user => {
                            return User.findById(user._id).select('-__v').lean()
                                .then(user => {
                                    user.id = user._id
                                    delete user._id
                                    delete user.password
                                    return user
                                })
                        })
                })
        }
    },

    authenticateUser(email, password) {
        return User.findOne({ email }).select('-__v').lean()
            .then((user) => {
                return bcrypt.compare(password, user.password)
                    .then((match) => {
                        if (match) {
                            return user
                        }
                        else {
                            throw Error("Wrong Credentials")
                        }
                    })
                    .catch(({ message }) => {
                        throw Error(message)
                    })
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    },

    getUserById(userId) {
        return User.findById(userId).select('-__v').lean()
            .then((user) => {
                user.id = user._id
                delete user._id
                return user
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    },

    editUserById(userId, content, editorId, editorRole) {
        if (userId == editorId || editorRole == "admin") {
            return User.findByIdAndUpdate(userId, content)
                .then(() => {
                    return User.findById(userId).select('-__v').lean()
                        .then(user => {
                            user.id = user._id
                            delete user._id
                            return user
                        })
                })
        } else {
            throw Error("You cannot modify this user")
        }
    },

    addMyBusiness(userId, businesId) {
        return User.findById(userId)
            .then(user => {
                user.myBusiness.push(businesId)
                return user.save()
            })
    }

}

module.exports = logic
