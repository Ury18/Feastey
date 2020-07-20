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
    const { to, changePassUrl } = data
    return {
        from: 'no-reply@feastey.com',
        to: to,
        subject: 'Feasty - Verficicación de cuenta',
        html: `<h1>Se ha solicitado un cambio de contraseña. Si no has sido tu, ignora este mensaje.
        Si has sido tu Haz click <a href="${changePassUrl}">aqui</a> para cambiar tu cuenta.`
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
