const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const logic = require('../models/user/logic')

const userRouter = express.Router();

userRouter.route('/')
    .get((req, res) => {
       logic.getUsers()
            .then((users) => {
                res.json(users)
            })
            .catch((err) => {
                res.json(err)
            })
    })
    .post((req, res) => {
        logic.createUser(req.body)
            .then(function (user) {
                res.status(201).send(user)
            })
            .catch(function (err) {
                res.status(400).send(err)
            })
    })

//Endpoint to authenticate
userRouter.route('/authenticate')
    .post((req, res) => {

    })

// Middleware for /:userId
userRouter.use('/:userId', (req, res, next) => {
    logic.getUserById(req.params.userId)
        .then((user) => {
            req.user = user;
            next()
        })
        .catch((err) => {
            err.reason = "User could not be found"
            res.status(500).send(err)
        })
})

//Endpoints for /:userId
userRouter.route('/:userId')
    .get((req, res) => {
        res.json(req.user)
    })
    .put((req, res) => {
        logic.editUserById(req.user.id, req.body)
            .then((user) => {
                res.json(user)
            })
            .catch((err) => {
                res.json(err)
            })
    })

module.exports = userRouter
