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
        } catch({message}) {
            res.status(400).json({ error: message })
        }
    })
    .post(tokenVerifierMiddleware, (req, res) => {
        if (!req.tokenUserId) {
            res.status(400).send({ error: "Insuficient permissions" })
        }

        try {
            logic.createBussiness(req.tokenUserId, req.body)
            .then((bussiness) => {
                res.status(201).send(bussiness)
            })
            .catch(({message}) => {
                res.status(400).json({ error: message })
            })
        } catch({message}) {
            res.status(400).send({ error: message })
        }
    })

module.exports = bussinessRouter
