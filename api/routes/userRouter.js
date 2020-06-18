const express = require('express')
const logic = require('../models/user/logic')
const { createToken, tokenVerifierMiddleware } = require('../middleware/token-helper')

const userRouter = express.Router();

userRouter.route('/')
    .get(tokenVerifierMiddleware, (req, res) => {
        try {
            logic.getUsers()
                .then((users) => {
                    if(req.tokenUserRole == "admin") {
                        res.status(200).json(users)
                    } else {
                        users.forEach(user => {
                            delete user.password
                        })
                        res.status(200).json(users)
                    }
                })
                .catch(({ message }) => {
                    res.json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })
    .post(tokenVerifierMiddleware, (req, res) => {
        try {
            logic.createUser(req.body, req.tokenUserId, req.tokenUserRole)
                .then((user) => {
                    res.status(200).send(user)
                })
                .catch(({ message }) => {
                    res.status(400).send({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

//Endpoint to authenticate
userRouter.route('/authenticate')
    .post((req, res) => {
        const { body: { email, password } } = req
        try {
            logic.authenticateUser(email, password)
                .then((user) => {
                    const token = createToken(user._id)
                    res.json({ token, id: user._id })
                })
                .catch(({ message }) => {
                    res.status(401).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

// Middleware for /:userId
userRouter.use('/:userId', (req, res, next) => {
    try {
        logic.getUserById(req.params.userId)
            .then((user) => {
                req.user = user;
                next()
            })
            .catch(({ message }) => {
                res.status(401).send({ error: message })
            })
    } catch ({ message }) {
        res.status(400).send({ error: message })
    }
})

//Endpoints for /:userId
userRouter.route('/:userId')
    .get(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserId == req.user.id) {
            res.json(req.user)
        } else {
            res.json({ username: req.user.username, id: req.user.id })
        }
    })
    .put(tokenVerifierMiddleware, (req, res) => {
        try {
            logic.editUserById(req.user.id, req.body, req.tokenUserId, req.tokenUserRole)
                .then((user) => {
                    res.json(user)
                })
                .catch(({ message }) => {
                    res.status(401).send({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

module.exports = userRouter