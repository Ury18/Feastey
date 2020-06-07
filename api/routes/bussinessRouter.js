const express = require('express')
const logic = require('../models/bussiness/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')

const bussinessRouter = express.Router()

bussinessRouter.route('/')
    .get((req, res) => {
        try {
            logic.getBussiness()
                .then((bussinesses) => {
                    res.json(bussinesses)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })
    .post(tokenVerifierMiddleware, (req, res) => {
        if (!req.tokenUserId) {
            res.status(400).send({ error: "Insuficient permissions" })
        }

        try {
            logic.createBussiness(req.tokenUserId, req.tokenUserRole, req.body)
                .then((bussiness) => {
                    res.status(201).send(bussiness)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

bussinessRouter.use('/:bussinessId', (req, res, next) => {
    try {
        logic.getBussinessById(req.params.bussinessId)
            .then((bussiness) => {
                req.bussiness = bussiness
                next()
            })
            .catch(({ message }) => {
                res.status(400).send({ error: message })
            })
    } catch ({ message }) {
        res.status(400).send({ error: message })
    }
})

bussinessRouter.route('/:bussinessId')
    .get((req,res) => {
        res.status(201).json(req.bussiness)
    })
    .put(tokenVerifierMiddleware, (req,res) => {
        try {
            logic.editBussiness(req.tokenUserId, req.tokenUserRole, req.bussiness.id, req.body)
                .then((bussiness) => {
                    res.status(200).json(bussiness)
                })
                .catch(({message}) => {
                    res.status(400).send({ error: message })
                })

        } catch({message}) {
            res.status(400).send({ error: message })
        }
    })

module.exports = bussinessRouter
