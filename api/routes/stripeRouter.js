const express = require('express')
const logic = require('../models/file/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')
const stripeHelper = require('../middleware/stripe-helper')
const stripeRouter = express.Router()

stripeRouter.route('/')
    .post(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "businessOwner" && req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        } else {

            try {
                stripeHelper.createSubscriber(req.body.email)
                .then(customer => {
                    res.status(200).send({ customer })
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
            } catch ({ message }) {
                res.status(400).send({ error: message })
            }
        }
    })

stripeRouter.route('/create-subscription')
    .post(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "businessOwner" && req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        } else {

            try {
                stripeHelper.createSubscription(req.body.customerId, req.body.paymentMethodId, req.body.priceId)
                    .then(subscription => {
                        res.status(200).send(subscription)
                    })
                    .catch(({ message }) => {
                        res.status(400).json({ error: message })
                    })
            } catch ({ message }) {
                res.status(400).send({ error: message })
            }
        }
    })


module.exports = stripeRouter
