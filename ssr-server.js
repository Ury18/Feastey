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

const { UserRouter, BusinessRouter, FileRouter, CategoryRouter } = require('./api/routes')

// const httpsOptions = {
//     key: readFileSync(`${certPath}/privkey.pem`),
//     cert: readFileSync(`${certPath}/cert.pem`),
//     ca: readFileSync(`${certPath}/chain.pem`)
// }

const httpsServer = express()
const httpServer = express()

if (dev) {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

mongoose.connect(db_url, { useNewUrlParser: true })
    .then(() => {
        nextApp.prepare()
            .then(() => {

                // httpServer.all("*", function (req, res) {
                //     if (dev) {
                //         res.redirect("https://" + req.hostname + ":" + httpsPort + req.path);
                //     } else {
                //         res.redirect("https://" + req.hostname + "/" + req.path);
                //     }
                // });

                //Used to verify certbot key
                // httpServer.use(express.static(__dirname + '/static', {dotfiles: 'allow'}))

                httpServer.use(bodyParser.json())
                httpServer.use(bodyParser.urlencoded({ extended: true }))


                httpServer.use('/api/users', UserRouter)
                httpServer.use('/api/business', BusinessRouter)
                httpServer.use('/api/files', FileRouter)
                httpServer.use('/api/categories', CategoryRouter)

                //Handles react
                httpServer.all('*', (req, res) => {
                    return handle(req, res)
                })

                http.createServer(httpServer).listen(httpPort, () => {
                    console.log(`Server Running in port ${httpPort}`)
                })

                // https.createServer(httpsOptions, httpsServer).listen(httpsPort, () => {
                //     console.log(`Server Running in port ${httpsPort}`)
                // })

            })
    })



