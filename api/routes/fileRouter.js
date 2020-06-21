const express = require('express')
const logic = require('../models/file/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')
const { fileParser } = require("../middleware/file-parser")

const fileRouter = express.Router()

fileRouter.route('/')
    // .get((req, res) => {
    //     try {
    //         logic.getBusiness()
    //             .then((businesses) => {
    //                 res.json(businesses)
    //             })
    //             .catch(({ message }) => {
    //                 res.status(400).json({ error: message })
    //             })
    //     } catch ({ message }) {
    //         res.status(400).json({ error: message })
    //     }
    // })
    .post(tokenVerifierMiddleware, fileParser, (req, res) => {

        if (req.tokenUserRole !== "businessOwner" && req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        }

        try {
            logic.uploadFile(req.tokenUserId, req.tokenUserRole, req.body, req.files[0])
                .then((file) => {
                    res.status(201).send(file)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })
fileRouter.route('/:fileId')
    .delete(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "businessOwner" && req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        }

        try {
            logic.deleteFile(req.tokenUserId, req.tokenUserRole, req.params.fileId)
                .then((file) => {
                    res.status(201).send(file)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })

        } catch({message}) {

            res.status(400).send({ error: message })
        }
    })

// fileRouter.use('/:businessId', (req, res, next) => {
//     try {
//         logic.getBusinessById(req.params.businessId)
//             .then((business) => {
//                 req.business = business
//                 next()
//             })
//             .catch(({ message }) => {
//                 res.status(400).send({ error: message })
//             })
//     } catch ({ message }) {
//         res.status(400).send({ error: message })
//     }
// })

// fileRouter.route('/:businessId')
//     .get((req, res) => {
//         res.status(201).json(req.business)
//     })
//     .put(tokenVerifierMiddleware, (req, res) => {
//         try {
//             logic.editBusiness(req.tokenUserId, req.tokenUserRole, req.business.id, req.body)
//                 .then((business) => {
//                     res.status(200).json(business)
//                 })
//                 .catch(({ message }) => {
//                     res.status(400).send({ error: message })
//                 })

//         } catch ({ message }) {
//             res.status(400).send({ error: message })
//         }
//     })

module.exports = fileRouter
