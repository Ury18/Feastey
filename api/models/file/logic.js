require('dotenv').config()
var File = require('./index')
var admin = require("firebase-admin")
var serviceAccount = require('./serviceAccountkey.json')
const streamifier = require('streamifier')
const storageUrl = process.env.STORAGE_URL

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageUrl
})

logic = {

    async uploadFile(uploaderId, uploaderRole, data, file) {

        const { name, type } = data

        let date = new Date();
        const curr_date = date.getDate();
        const curr_month = date.getMonth();
        const curr_year = date.getFullYear();
        const curr_minutes = date.getMinutes();
        const curr_seconds = date.getSeconds();

        date = `${curr_date}-${curr_month}-${curr_year}_${curr_minutes}:${curr_seconds}`

        const bucket = admin.storage().bucket()
        const fileTitle = `${uploaderId}-${name}-${date}.${type}`
        const fileUpload = await bucket.file(fileTitle)
        const contentType = type == "pdf" ? 'application/pdf' : type == 'png' ? 'image/png' : 'image/jpeg'
        const fileBlobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: contentType
            }
        })

        await streamifier.createReadStream(file.buffer).pipe(fileBlobStream)

        let uploadedFile = await bucket.file(fileTitle)
        let finalUploadedFile = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '01-01-2500'
        })

        return File.create({ name, url: finalUploadedFile[0], type, file_title: fileTitle })
            .then(file => {
                return File.findById(file._id).select('-__v').lean()
                    .then(file => {
                        return file
                    })
            })
    },

    deleteFile(deleterId, deleterRole, fileId) {
        return File.findById(fileId)
            .then(file => {
                const bucket = admin.storage().bucket()
                const stored_file = bucket.file(file.file_title)
                return stored_file.delete()
                    .then(() => {
                        return file.remove()
                            .then(() => {
                                return { message: "File deleted" }
                            })
                    })

            })
            .catch(({ message }) => {
                throw Error(message)
            })
    }

}


module.exports = logic
