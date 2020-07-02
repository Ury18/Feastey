const express = require('express')
const logic = require('../models/file/logic')
const { tokenVerifierMiddleware } = require('../middleware/token-helper')
const { fileParser } = require("../middleware/file-parser")

const fileRouter = express.Router()

fileRouter.route('/')
    .get(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        }
        try {
            logic.getFiles()
                .then((files) => {
                    res.json(files)
                })
                .catch(({ message }) => {
                    res.status(400).json({ error: message })
                })
        } catch ({ message }) {
            res.status(400).json({ error: message })
        }
    })
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

fileRouter.route('/delete-multiple')
    .post(tokenVerifierMiddleware, (req, res) => {
        try {
            logic.deleteMultipleFiles(req.tokenUserId, req.tokenUserRole, req.body.files)
                .then((value) => {
                    res.status(201).send(value)
                })
        } catch ({ message }) {
            res.status(400).send({ error: message })
        }
    })

fileRouter.use('/:fileId', (req, res, next) => {
    try {
        logic.getFile(req.params.fileId)
            .then((file) => {
                req.file = file
                next()
            })
            .catch(({ message }) => {
                res.status(400).send({ error: message })
            })
    } catch ({ message }) {
        res.status(400).send({ error: message })
    }
})

fileRouter.route('/:fileId')
    .get((req, res) => {
        res.status(201).json(req.file)
    })
    .put(tokenVerifierMiddleware, (req, res) => {
        if (req.tokenUserRole !== "businessOwner" && req.tokenUserRole !== "admin") {
            res.status(400).send({ error: "Insuficient permissions" })
        }
        try {
            logic.updateFile(req.tokenUserId, req.tokenUserRole, req.body, req.params.fileId)
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

        } catch ({ message }) {

            res.status(400).send({ error: message })
        }
    })

module.exports = fileRouter
