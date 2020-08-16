const fs = require('fs');
const QRCode = require('qrcode')
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas');
const NODE_PATH = process.env.NODE_PATH
const HOST = process.env.HOST

const qrHelper = {

    generateQr(businessId, width) {
        return new Promise((resolve, reject) => {
            return QRCode.toFile(`${NODE_PATH}/public/tmp/qr/${businessId}.png`, `${HOST}/business/${businessId}`, {
                color: {
                    light: '#0000' // Transparent background,
                },
                width: width || 300

            }, function (err) {
                if (err) reject(err)
                resolve({})
            })
        })
    },

    mergeQr(businessId, fileName, altName, lang, position) {

        if (!position) position = { x: 50, y: 50 }

        return mergeImages(
            [
                `${NODE_PATH}/public/img/qrs/${fileName}${lang ? "_" + lang : ""}.png`,
                { src: `${NODE_PATH}/public/tmp/qr/${businessId}.png`, x: position.x, y: position.y }
            ],
            {
                Canvas: Canvas,
                Image: Image
            }
        )
            .then(b64 => {
                let base64Image = b64.split(';base64,').pop();
                return new Promise((resolve, reject) => {
                    fs.writeFile(`${NODE_PATH}/public/tmp/qr/finalQR-${altName}-${businessId}${lang ? "_" + lang : ""}.png`, base64Image, { encoding: 'base64' }, function (err) {
                        fs.unlink(`${NODE_PATH}/public/tmp/qr/${businessId}.png`, function (err) {
                            resolve({})
                        })
                    })
                })
            })
    },

}



module.exports = qrHelper
