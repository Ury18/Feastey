const User = require('./index')
const bcrypt = require('bcrypt')

logic = {

    getUsers() {
        return User.find({})
    },

    createUser(userData) {
        let user = new User(userData)
        return bcrypt.hash(user.password, 10)
        .then((hash) => {
            user.password = hash
            return user.save()
        })
    },

    authenticateUser(email, password) {
        return User.findOne({email})
            .then((user) => {

            })
    },

    getUserById(userId, token) {
        return User.findById(userId)
            .then((user) => {
                if(!token) {
                    newUser = {username: user.username, id: user._id}
                    return newUser
                } else {
                    return user
                }
            })
            .catch((err) => {
                throw Error(err)
            })
    },

    editUserById(userid, content) {
        return User.findByIdAndUpdate(userid, content, function (err, result) {
            if (err) {
                throw Error(err)
            } else {
                return result
            }
        })

    }

}

module.exports = logic
