const User = require("../models/user")
const Category = require("../models/category")
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


        let alimentacionCategory = {
            name: "Alimentación"
        }
        let alimentacion = new Category(alimentacionCategory)
        await alimentacion.save()


        let drogueriaCategory = {
            name: "Droguería y Perfumería"
        }
        let drogueria = new Category(drogueriaCategory)
        await drogueria.save()


        let electroCategory = {
            name: "Electrodomésticos y Tecnología"
        }
        let electro = new Category(electroCategory)
        await electro.save()


        let esteticaCategory = {
            name: "Estética"
        }
        let estetica = new Category(esteticaCategory)
        await estetica.save()


        let ferreteriaCategory = {
            name: "Ferretería y Bricolaje"
        }
        let ferreteria = new Category(ferreteriaCategory)
        await ferreteria.save()


        let jardinCategory = {
            name: "Floristería y Jardinería"
        }
        let jardin = new Category(jardinCategory)
        await jardin.save()


        let hogarCategory = {
            name: "Hogar, Muebles y Menaje"
        }
        let hogar = new Category(hogarCategory)
        await hogar.save()


        let inmobiliariaCategory = {
            name: "Inmobiliaria"
        }
        let inmobiliaria = new Category(inmobiliariaCategory)
        await inmobiliaria.save()


        let joyeriaCategory = {
            name: "Joyería y Relojería"
        }
        let joyeria = new Category(joyeriaCategory)
        await joyeria.save()


        let modaCategory = {
            name: "Moda y Calzado"
        }
        let moda = new Category(modaCategory)
        await moda.save()


        let ocioCategory = {
            name: "Ocio"
        }
        let ocio = new Category(ocioCategory)
        await ocio.save()


        let papeleriaCategory = {
            name: "Papelería y Librería"
        }
        let papeleria = new Category(papeleriaCategory)
        await papeleria.save()


        let restauracionCategory = {
            name:"Restauración y Bares"
        }
        let restauracion = new Category(restauracionCategory)
        await restauracion.save()


        let saludCategory = {
            name: "Salud"
        }
        let salud = new Category(saludCategory)
        await salud.save()


        let serviciosCategory = {
            name: "Servicios"
        }
        let servicios = new Category(serviciosCategory)
        await servicios.save()


        let talleresCategory = {
            name: "Talleres"
        }
        let talleres = new Category(talleresCategory)
        await talleres.save()


        let otrosCategory = {
            name: "Otros"
        }
        let otros = new Category(otrosCategory)
        await otros.save()

        console.log("Todas las categorias han sido creadas")

    }
}
