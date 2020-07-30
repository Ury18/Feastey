const fs = require('fs');
const QRCode = require('qrcode')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas');
const NODE_PATH = process.env.NODE_PATH
const HOST = process.env.HOST

const qrHelper = {

    generateQr(businessId) {
        return new Promise((resolve, reject) => {
            return QRCode.toFile(`${NODE_PATH}/public/tmp/qr/${businessId}.png`, `${HOST}/business/${businessId}`, {
                color: {
                    light: '#0000' // Transparent background,
                },
                width: 300

            }, function (err) {
                if (err) reject(err)
                resolve({})
            })
        })
    },

    mergeQr(businessId) {
        return mergeImages(
            [
                `${NODE_PATH}/public/img/Table-QR-Template.png`,
                { src: `${NODE_PATH}/public/tmp/qr/${businessId}.png`, x: 50, y: 50 }
            ],
            {
                Canvas: Canvas,
                Image: Image
            }
        )
            .then(b64 => {
                let base64Image = b64.split(';base64,').pop();
                return new Promise((resolve, reject) => {
                    fs.writeFile(`${NODE_PATH}/public/tmp/qr/finalQR-${businessId}.png`, base64Image, { encoding: 'base64' }, function (err) {
                        fs.unlink(`${NODE_PATH}/public/tmp/qr/${businessId}.png`, function (err) {
                            resolve({})
                        })
                    })
                })
            })
    }

}



module.exports = qrHelper
