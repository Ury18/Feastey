const express = require('express')
const logic = require('../models/business/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')
const businessRouter = express.Router(process.env.STRIPE_KEY)

businessRouter.route('/')
    .get((req, res) => {
        try {
            logic.getBusiness()
                .then((businesses) => {
                    let newBusinesses = []
                    businesses.forEach(element => {
                        newBusinesses.push({
                            name: element.name,
                            id: element.id
                        })
                    })
                    res.json(newBusinesses)
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

businessRouter.route('/generate-qrs')
    .post(tokenVerifierMiddleware, (req, res) => {
        if(req.tokenUserRole !=="businessOwner" && req.tokenUserRole !=="admin")res.status(400).json({error:"Insuficient Permissions"})
        try {
            logic.createQrsByLanguage(req.body.businessId, req.body.lang)
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

businessRouter.route('/multiple-businesses')
    .post((req, res) => {
        try {
            logic.getMultipleBusinesses(req.body)
                .then((businesses) => {
                    res.status(201).json(businesses)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

businessRouter.route('/payment-failed')
    .post((req, res) => {
        try {
            logic.onPaymentFailed(req.body)
                .then(result => {
                    res.status(201).json(result)
                })
                .catch(({ message }) => {
                    res.status(400).send({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })
businessRouter.route('/payment-success')
    .post((req, res) => {
        try {
            logic.onPaymentSuccess(req.body)
                .then(result => {
                    res.status(201).json(result)
                })
                .catch(({ message }) => {
                    res.status(400).send({ error: message })
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
    .get(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserId) {
            if (req.tokenUserId.toString() !== req.business.owner.toString() && req.tokenUserRole !== "admin") {
                delete req.business.stripe
            }
        }
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
