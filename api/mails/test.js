const nodemailer = require("nodemailer")

let transport = nodemailer.createTransport({
    host: "smtp.feastey.com",
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: "feastey@feastey.com",
        pass:"Alberiol-9498"
    }
})


const message = {
    from: 'feastey@feastey.com',
    to: 'ury_98@hotmail.com',
    subject: '¡Benvenido a Feasty!',
    html: '<h1>Gracias por unirte a la familia.</h1> ¡Descubre tu barrio y ayuda a los comercios que hay en él con Feasty!'
}

test = {
    send() {
        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    }
}

module.exports = test
