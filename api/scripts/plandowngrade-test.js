require('dotenv').config({ path: "../../" + '/.env' })
const mongoose = require("mongoose")
const db_url = process.env.DB_URL
const Business = require("../models/business")
const User = require("../models/user")
const BusinessLogic = require("../models/business/logic")
const FileLogic = require("../models/file/logic")

mongoose.connect(db_url, {
    useNewUrlParser: true,
    user: "feastey",
    pass: "oec123",
})
    .then(async () => {

        let business = await Business.findOne({ "stripe.subscriptionId": "sub_Hp2xskRgbsntcM" }).populate("owner")
        return BusinessLogic.planDowngradeDeleteFiles(business)
        .then((res) => console.log(res))
        /*
        if (business.planDowngrade) {
            let newPlan = business.newSubscriptionPlan
            //Check that it's not surpassing maximum files and images depending on plan
            if (newPlan == "free" || newPlan == "plus") {
                let imageLimit = newPlan == "free" ? 20 : 30
                let filesLimit = newPlan == "free" ? 4 : 8

                let files = [];

                business.attachments.forEach(element => {
                    element.files.forEach(file => {
                        files.push(file)
                    })
                })

                if (business.images.length > imageLimit) {
                    let deletingImages = business.images.slice(0, imageLimit)
                    let remainingImages = business.images.slice(imageLimit)

                    //Borrar imagenes excedentes
                    let deletedImages = await FileLogic.deleteMultipleFiles(business.owner._id, "admin", deletingImages)

                    business.images = remainingImages
                }

                if (files.length > filesLimit) {
                    let deletingFiles = files.slice(filesLimit-1)
                    let remainingFiles = files.slice(0, filesLimit)

                    //Borrar archivos excedentes
                    let deletedFiles = await FileLogic.deleteMultipleFiles(business.owner._id, "admin", deletingFiles)

                    business.attachments.forEach(element => {
                        for (var i = 0; i < deletingFiles.length; i++) {
                            let index = element.files.indexOf(deletingFiles[i])
                            if (index !== "-1") {
                                element.files.splice(index, 1)
                            }
                        }
                    })

                    let newAttachments = []

                    for (var i = 0; i < business.attachments.length; i++) {
                        if (business.attachments[i].files.length !== 0) newAttachments.push(business.attachments[i])
                    }

                    business.attachments = newAttachments
                }

            }

            business.subscriptionPlan = newPlan
            business.planDowngrade = false
            business = await business.save()
            console.log(business)
        }
           */
    })
