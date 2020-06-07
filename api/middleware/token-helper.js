const jwt = require('jsonwebtoken')
const userLogic = require('../models/user/logic')

const tokenHelper = {
    jwtSecret: "comercio",

    createToken(userId) {
        return jwt.sign({ sub: userId }, this.jwtSecret, { expiresIn: '4h' })
    },

    verifyToken(token) {
        const { sub } = jwt.verify(token, this.jwtSecret)

        if (!sub) {
            throw Error(`Subject not present in ${Token}`)
        }

        return sub
    },

    tokenVerifierMiddleware(req, res, next) {
        const { headers: { authorization } } = req

        if (authorization) {
            const token = authorization.substring(7)

            try {
                const userId = this.verifyToken(token)
                req.tokenUserId = userId

                return userLogic.getUserById(userId)
                    .then(user => {
                        req.tokenUserRole = user.role
                        next()
                    })
                    .catch(({message}) => {
                        req.tokenUserRole = null
                        next()
                    })

            } catch ({ message }) {
                req.tokenUserId = null
                next()
            }

        } else {
            req.tokenUserId = null
            next()
        }

    }

}

const { createToken, verifyToken, tokenVerifierMiddleware } = tokenHelper

tokenHelper.createToken = createToken.bind(tokenHelper)
tokenHelper.verifyToken = verifyToken.bind(tokenHelper)
tokenHelper.tokenVerifierMiddleware = tokenVerifierMiddleware.bind(tokenHelper)

module.exports = tokenHelper
