const express = require('express')
const logic = require('../models/user/logic')
const { createToken, tokenVerifierMiddleware } = require('../middleware/token-helper')

const userRouter = express.Router();

userRouter.route('/')
    .get((req, res) => {
        logic.getUsers()
            .then((users) => {
                res.json(users)
            })
            .catch(({ message }) => {
                res.json({error: message})
            })
    })
    .post(tokenVerifierMiddleware , (req, res) => {
        logic.createUser(req.body, req.tokenUserId)
            .then((user) => {
                res.status(201).send(user)
            })
            .catch(({message}) => {
                res.status(400).send({error: message})
            })
    })

//Endpoint to authenticate
userRouter.route('/authenticate')
    .post((req, res) => {
        const { body: { email, password } } = req
        logic.authenticateUser(email, password)
            .then((user) => {
                const token = createToken(user._id)
                res.json({ token, id:user._id })
            })
            .catch(({ message }) => {
                res.status(401).json({ error: message })
            })
    })

// Middleware for /:userId
userRouter.use('/:userId', (req, res, next) => {
    logic.getUserById(req.params.userId)
        .then((user) => {
            req.user = user;
            next()
        })
        .catch(({message}) => {
            res.status(401).send({error: message})
        })
})

//Endpoints for /:userId
userRouter.route('/:userId')
    .get(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserId == req.user._id) {
            res.json(req.user)
        } else {
            res.json({username: req.user.username})
        }
    })
    .put(tokenVerifierMiddleware, (req, res) => {
        logic.editUserById(req.user._id, req.body, req.tokenUserId)
            .then((user) => {
                res.json(user)
            })
            .catch(({message}) => {
                res.status(401).send({error: message})
            })
    })

module.exports = userRouter
