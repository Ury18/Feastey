const express = require('express')
const logic = require('../models/business/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')

const businessRouter = express.Router()

businessRouter.route('/')
    .get((req, res) => {
        try {
            logic.getBusiness()
                .then((businesses) => {
                    res.json(businesses)
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
            logic.createBusiness(req.tokenUserId, req.tokenUserRole, req.body)
                .then((business) => {
                    res.status(201).send(business)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })
businessRouter.route('/geobusiness')
    .post((req, res) => {
        try {
            logic.getBusinessByDistance(req.body)
                .then((businesses) => {
                    res.status(201).send(businesses)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

businessRouter.route('/multiple-businesses')
    .post((req, res) => {
        try {
            logic.getMultipleBusinesses(req.body)
                .then((businesses) => {
                    console.log(businesses)
                    res.status(201).json(businesses)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

businessRouter.use('/:businessId', (req, res, next) => {
    try {
        logic.getBusinessById(req.params.businessId)
            .then((business) => {
                req.business = business
                next()
            })
            .catch(({ message }) => {
                res.status(400).send({ error: message })
            })
    } catch ({ message }) {
        res.status(400).send({ error: message })
    }
})

businessRouter.route('/:businessId')
    .get((req, res) => {
        res.status(201).json(req.business)
    })
    .put(tokenVerifierMiddleware, (req, res) => {
        try {
            logic.editBusiness(req.tokenUserId, req.tokenUserRole, req.business.id, req.body)
                .then((business) => {
                    res.status(200).json(business)
                })
                .catch(({ message }) => {
                    res.status(400).send({ error: message })
                })

        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })


module.exports = businessRouter
