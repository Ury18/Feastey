require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const db_url = process.env.DB_URL
const mongoose = require('mongoose')

const next = require('next')
const dev = process.env.NODE_DEV !== 'production'
const nextApp = next({dev})
const handle = nextApp.getRequestHandler()

const { UserRouter } = require('./api/routes')

mongoose.connect(db_url, {useNewUrlParser: true})
    .then(() => {
        nextApp.prepare()
            .then(() => {

                const app = express()

                app.use(bodyParser.json())
                app.use(bodyParser.urlencoded({ extended: true }))

                app.use('/api/Users', UserRouter)

                //Handles react
                app.get('*', (req, res) => {
                    return handle(req, res)
                })

                app.listen(port, () => {
                    console.log(`Server Running in port ${port}`)
                })
        })

    })



