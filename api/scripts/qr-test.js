const QRCode = require('qrcode')

QRCode.toFile('./test.png', 'http://ury.feastey.com', {
    color: {
        light: '#0000' // Transparent background,
        //light: '#ffff' // White background
    },
    width: 300

}, function (err) {
    if (err) throw err
    console.log('done')
})