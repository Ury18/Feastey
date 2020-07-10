const nodemailer = require("nodemailer")

let transport = nodemailer.createTransport({
    host: "smtp.feastey.com",
    port: 578,
    auth: {
        user: "feastey@feastey.com",
        pass: "Alberiol-9498"
    }
})

const message = {
    from: 'feastey@feastey.com',
    to: 'albert_escoli@hotmail.com',
    subject: '¡Benvenido a Feasty!',
    text: '<h1>Gracias por unirte a la familia.</h1> ¡Descubre tu barrio y ayuda a los comercios que hay en él con Feasty!'
}

test = {
    send(data) {
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