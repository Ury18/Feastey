require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const next = require('next')
const https = require("https")
const http = require("http")
const { readFileSync } = require("fs")

const httpPort = process.env.HTTP_PORT || 80
const httpsPort = process.env.HTTPS_PORT || 443
const certPath = process.env.SSL_CERT_PATH
const db_url = process.env.DB_URL
const dev = process.env.NODE_DEV !== 'production'
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const { UserRouter, BusinessRouter, FileRouter, CategoryRouter, StripeRouter } = require('./api/routes')

const httpsOptions = {
    key: readFileSync(`${certPath}/privkey.pem`),
    cert: readFileSync(`${certPath}/cert.pem`),
    ca: readFileSync(`${certPath}/chain.pem`)
}

const httpsServer = express()
const httpServer = express()

if (dev) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

mongoose.connect(db_url, {
    seNewUrlParser: true,
    user:"feastey",
    pass: "oec123",
})
    .then(() => {
        nextApp.prepare()
            .then(() => {

                httpServer.all("*", function (req, res) {
                    if (dev) {
                        res.redirect("https://" + req.hostname + ":" + httpsPort + req.path);
                    } else {
                        res.redirect("https://" + req.hostname + req.path);
                    }
                });

                //Used to verify certbot key
                // httpServer.use(express.static(__dirname + '/static', {dotfiles: 'allow'}))

                httpsServer.use(bodyParser.json())
                httpsServer.use(bodyParser.urlencoded({ extended: true }))


                httpsServer.use('/api/users', UserRouter)
                httpsServer.use('/api/business', BusinessRouter)
                httpsServer.use('/api/files', FileRouter)
                httpsServer.use('/api/categories', CategoryRouter)
                httpsServer.use('/api/stripe', StripeRouter)

                //Handles react
                httpsServer.all('*', (req, res) => {
                    return handle(req, res)
                })

                http.createServer(httpServer).listen(httpPort, () => {
                    console.log(`Server Running in port ${httpPort}`)
                })

                https.createServer(httpsOptions, httpsServer).listen(httpsPort, () => {
                    console.log(`Server Running in port ${httpsPort}`)
                })

            })
    })
