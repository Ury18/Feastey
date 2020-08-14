const express = require('express')
const logic = require('../models/category/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')


const categoryRouter = express.Router()

categoryRouter.route('/')
    .get((req, res) => {
        try {
            logic.getCategories()
                .then((categories) => {
                    res.json(categories)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })
    .post(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        }
        try {
            logic.createCategory(req.body)
                .then((categories) => {
                    res.json(categories)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }

    })

module.exports = categoryRouter
