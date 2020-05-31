const jwt = require('jsonwebtoken')

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
            } catch ({ message }) {
                req.tokenUserId = null
            }

        } else {
            req.tokenUserId = null
        }

        next()
    }

}

const { createToken, verifyToken, tokenVerifierMiddleware } = tokenHelper

tokenHelper.createToken = createToken.bind(tokenHelper)
tokenHelper.verifyToken = verifyToken.bind(tokenHelper)
tokenHelper.tokenVerifierMiddleware = tokenVerifierMiddleware.bind(tokenHelper)

module.exports = tokenHelper
