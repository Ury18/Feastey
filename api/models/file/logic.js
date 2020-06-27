require('dotenv').config()
var File = require('./index')
var admin = require("firebase-admin")
var serviceAccount = require('./serviceAccountkey.json')
const streamifier = require('streamifier')
const file = require('./index')
const storageUrl = process.env.STORAGE_URL

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageUrl
})

logic = {

    getFiles() {
        return File.find({}).select("-__v").lean()
            .then(files => {
                files.forEach(file => {
                    file.id = file._id
                    delete file._id
                });
                return files
            })
    },

    getFile(fileId) {
        return File.findById(fileId).select("-__v").lean()
            .then(file => {
                file.id = file._id
                delete file._id
                return file
            })
    },

    async uploadFile(uploaderId, uploaderRole, data, file) {

        let { name, owner } = data

        if (uploaderRole !== "admin" && uploaderRole !== "businessOwner") {
            throw Error("Insufficient permissions")
        }

        if (!owner) {
            owner = uploaderId
        }

        let type = file.mimetype
        const contentType = type == "application/pdf" ? 'pdf' : type == 'image/png' ? 'png' : 'image/jpeg'

        let date = new Date();
        let curr_date = date.getDate();
        let curr_month = date.getMonth().toString();
        if (curr_month.length < 2) {
            curr_month = `0${curr_month}`
        }
        let curr_year = date.getFullYear().toString();
        if (curr_year.length < 2) {
            curr_year = `0${curr_year}`
        }
        let curr_hour = date.getHours().toString();
        if (curr_hour.length < 2) {
            curr_hour = `0${curr_hour}`
        }
        let curr_minutes = date.getMinutes().toString();
        if (curr_minutes.length < 2) {
            curr_minutes = `0${curr_minutes}`
        }
        let curr_seconds = date.getSeconds().toString();
        if (curr_seconds.length < 2) {
            curr_seconds = `0${curr_seconds}`
        }

        date = `${curr_date}-${curr_month}-${curr_year}_${curr_hour}:${curr_minutes}:${curr_seconds}`

        const bucket = admin.storage().bucket()
        const fileTitle = `${uploaderId}-${name}-${date}.${contentType}`
        const fileUpload = await bucket.file(fileTitle)
        const fileBlobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: type
            }
        })

        await streamifier.createReadStream(file.buffer).pipe(fileBlobStream)

        let uploadedFile = await bucket.file(fileTitle)
        let finalUploadedFile = await uploadedFile.getSignedUrl({
            action: 'read',
            expires: '01-01-2500'
        })

        return File.create({ name, url: finalUploadedFile[0], type, file_title: fileTitle, owner })
            .then(file => {
                return File.findById(file._id).select('-__v').lean()
                    .then(file => {
                        file.id = file._id
                        delete file._id
                        return file
                    })
            })
    },

    updateFile(updaterId, updaterRole, data, fileId) {
        const { name } = data
        return File.findById(fileId)
            .then(file => {
                if (file.owner.toString() !== updaterId.toString() && updaterRole !== "admin") {
                    console.log(file.owner !== updaterId)
                    console.log(updaterId)
                    console.log(file.owner)
                    throw Error("Insufficient permissions")
                }

                file.name = name
                return file.save()
                    .then(file => {
                        return File.findById(fileId).select("-__v").lean()
                            .then(file => {
                                file.id = file._id
                                delete file._id
                                return file
                            })
                            .catch(({ message }) => {
                                throw Error(message)
                            })
                    })
                    .catch(({ message }) => {
                        throw Error(message)
                    })
            })
            .catch(({ message }) => {
                throw Error(message)
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
