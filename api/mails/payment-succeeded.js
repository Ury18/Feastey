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
        pass: "Alberiol-9498"
    }
})


const message = (data) => {
    const { to, business } = data
    return {
        from: 'no-reply@feastey.com',
        to: to,
        subject: 'Feasty - Pago Realizado',
        html: `<h1>Hemos recibido el pago de tu suscripción de ${business.name}
        Eso es todo!.`
    }
}

email = {
    send(data) {
        let content = message(data)
        transport.sendMail(content, function (err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    }
}

module.exports = email
