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

    createUser(userData, creatorId) {
        let user = new User(userData)

        if (user.role == "admin") {
            return User.findById(creatorId).select('-__v').lean()
                .then((creatorUser) => {
                    if (creatorUser && creatorUser.role == "admin") {
                        return bcrypt.hash(user.password, 10)
                            .then((hash) => {
                                user.password = hash
                                return user.save()
                                    .then(user => {
                                        return User.findById(user._id).select('-__v').lean()
                                            .then(user => {
                                                user.id = user._id
                                                delete user._id
                                                return user
                                            })

                                    })
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
                                                            return user
                                                        })

                                                })
                                        })
                                }
                            })
                    }
                })
                .catch((err) => {
                    throw Error(err)
                })
        } else {
            return bcrypt.hash(user.password, 10)
                .then((hash) => {
                    user.password = hash
                    return user.save()
                        .then(user =>  {
                            return User.findById(user._id).select('-__v').lean()
                            .then(user => {
                                user.id = user._id
                                delete user._id
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

    getUserById(userId, token) {
        return User.findById(userId).select('-__v').lean()
            .then((user) => {
                if (!token) {
                    newUser = { username: user.username, id: user._id }
                    return newUser
                } else {
                    return user
                }
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    },

    editUserById(userId, content, editorId) {
        return User.findById(editorId).select('-__v').lean()
            .then((editorUser) => {
                if (userId == editorId || editorUser && editorUser.role == "admin") {
                    return User.findByIdAndUpdate(userId, content, function (err, result) {
                        if (err) {
                            throw Error(err.message)
                        } else {
                            return result
                        }
                    })
                } else {
                    throw Error("You cannot modify this user")
                }
            })
    }

}

module.exports = logic
