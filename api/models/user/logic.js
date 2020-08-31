const User = require('./index')
const bcrypt = require('bcrypt')
const { VerifyEmail, ChangePassword } = require('../../mails')
const stripeHelper = require('../../middleware/stripe-helper')

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

    createUser(userData, creatorRole, createToken) {

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
                    const token = createToken(user.id)
                    const verifyUrl = process.env.HOST + `/verify-user?auth=${token}`
                    return user.save()
                        .then(user => {
                            return User.findById(user._id).select('-__v').lean()
                                .then(user => {
                                    user.id = user._id
                                    delete user._id
                                    delete user.password
                                    VerifyEmail.send({ to: user.email, verifyUrl })
                                    return user
                                })
                        })
                })
        }
    },

    verifyUser(userId) {
        return User.findById(userId)
            .then(user => {
                user.isVerified = true
                return user.save()
                    .then(() => {
                        return User.findById(userId).select('-__v').lean()
                            .then(user => {
                                user.id = user._id
                                delete user._id
                                delete user.password
                                return user
                            })
                    })
            })
    },

    authenticateUser(email, password) {
        return User.findOne({ email }).select('-__v').lean()
            .then((user) => {
                return bcrypt.compare(password, user.password)
                    .then((match) => {
                        if (match) {
                            user.id = user._id
                            delete user._id
                            delete user.password

                            if (user.isVerified) {
                                return user
                            } else {
                                throw Error("Por favor, verifica tu email")
                            }
                        }
                        else {
                            throw Error("Contraseña incorrecta")
                        }
                    })
                    .catch(({ message }) => {
                        throw Error(message)
                    })
            })
            .catch(({ message }) => {
                if (message == "Cannot read property 'password' of null") throw Error("No se ha podido encontrar ningun usuario con el email indicado")
                throw Error(message)
            })
    },

    changePasswordRequest(email, createToken) {
        return User.find({ email }).select('-__v').lean()
            .then(user => {
                if (user.length > 0) {
                    user = user[0]
                } else {
                    return {}
                }
                if (user._id) {
                    const token = createToken(user._id, "1h")
                    const changePassUrl = process.env.HOST + `/change-password?auth=${token}&encpass=${user.password}`
                    ChangePassword.send({ to: email, changePassUrl })
                }

                delete user._id
                delete user.password
                return user
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    },

    changePasswordById(tokenUserId, tokenUserRole, data) {
        const { encpass, password, newPassword, newPasswordConfirmation, user } = data

        let userId = "";

        // if (tokenUserRole == "admin") {
        //     userId = user
        // } else {
        //     userId = tokenUserId
        // }

        userId = tokenUserId

        if (newPassword !== newPasswordConfirmation) {
            throw Error("Las contraseñas no coinciden")
        }

        return User.findById(userId)
            .then(user => {
                if (encpass) {
                    if (encpass == user.password) {
                        return bcrypt.hash(newPassword, 10)
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
                    } else {
                        throw Error("Insufficient Permissions")
                    }
                } else if (password) {
                    return bcrypt.compare(password, user.password)
                        .then((match) => {
                            if (match) {
                                return bcrypt.hash(newPassword, 10)
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
                            } else {
                                throw Error("Insufficient Permissions")
                            }
                        })
                }
            })
    },

    changeEmailById(tokenUserId, tokenUserRole, data) {
        const { password, user, email } = data

        let userId = "";

        // if (tokenUserRole == "admin") {
        //     userId = user.id || tokenUserId
        // } else {
        //     userId = tokenUserId
        // }

        userId = tokenUserId

        return User.findById(userId).populate("myBusinesses")
            .then(async (user) => {
                if (password) {
                    return bcrypt.compare(password, user.password)
                        .then(async (match) => {
                            if (match) {
                                user.email = email
                                let usedMail = await User.find({ email })
                                console.log(usedMail)
                                if (usedMail.length > 0) throw Error("Email en uso")
                                await user.myBusinesses.forEach(async (business) => {
                                    await stripeHelper.changeSubscriberEmail(business.stripe.customerId, email)
                                    return business
                                })
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
                            } else {
                                throw Error("Contraseña incorrecta")
                            }
                        })
                } else if (tokenUserRole == "admin") {
                    user.email = email
                    await user.myBusinesses.forEach(async (business) => {
                        let res = await stripeHelper.changeSubscriberEmail(business.stripe.customerId, email)
                        console.log(res)
                        return res
                    })
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
                } else {
                    throw Error("Insufficient Permissions")
                }
            })
    },

    getUserById(userId) {
        return User.findById(userId).select('-__v').lean()
            .then((user) => {
                user.id = user._id
                delete user._id
                delete user.password
                return user
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    },

    editUserById(userId, content, editorId, editorRole) {
        if (userId == editorId || editorRole == "admin") {
            if (content.email && editorRole !== "admin") delete content.email
            if (content.password && editorRole !== "admin") delete content.password

            return User.findByIdAndUpdate(userId, content)
                .then(() => {
                    return User.findById(userId).select('-__v').lean()
                        .then(user => {
                            user.id = user._id
                            delete user._id
                            delete user.password
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
                user.myBusinesses.push(businesId)
                return user.save()
                    .then(user => {
                        return User.findById(userId).select('-__v').lean()
                            .then(user => {
                                user.id = user._id
                                delete user._id
                                delete user.password
                            })
                    })
            })
    }

}

module.exports = logic
