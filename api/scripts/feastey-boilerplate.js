const User = require("../models/user")
const bcrypt = require('bcrypt')

module.exports = async () => {

    let admins = await User.find({ role: "admin" }).select('-__v').lean()

    if (admins.length == 0) {
        console.log("There's no admins")

        let adminData = {
            username: "Feastey (Admin)",
            email: "feastey@feastey.com",
            password: "butranco",
            role: "admin",
            isVerified: true
        }

        let admin = new User(adminData)
        let hash = await bcrypt.hash(admin.password, 10)
        admin.password = hash
        admin = await admin.save()
        admin = await User.findById(admin._id).select('-__v').lean()
        admin.id = admin._id
        delete admin._id
        delete admin.password
        console.log("Admin Created")
        return admin

    }
}
