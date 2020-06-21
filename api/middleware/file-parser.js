const path = require('path')
const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({ storage })

const uploadFile = upload.any(['file'])


function fileParser(req, res, next) {
    uploadFile(req, res, function (err) {
        if (err) throw Error(err.message)
        next()
    })
}

module.exports = { fileParser }
