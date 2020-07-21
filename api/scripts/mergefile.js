
const mergeImages = require('merge-images')
const { Canvas, Image } = require('canvas');
const fs = require('fs')

mergeImages(
    [
        './Table-QR-Template.png',
        { src: 'test.png', x:50 , y:50  }
    ],
    {
        Canvas: Canvas,
        Image: Image
    }
)
    .then(b64 => {
        let base64Image = b64.split(';base64,').pop();
        fs.writeFile('./finalQR.png', base64Image, { encoding: 'base64' }, function (err) {
            console.log('file created')
        })
    })