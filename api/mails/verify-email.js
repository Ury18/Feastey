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
    const { to, verifyUrl } = data
    return {
        from: 'no-reply@feastey.com',
        to: to,
        subject: 'Feasty - Verficicación de cuenta',
        html: `<h1>Gracias por unirte a Feastey.</h1> Haz click <a href="${verifyUrl}">aqui</a> para verificar tu cuenta.`
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
