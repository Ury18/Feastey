const Category = require('./index')

logic = {
    getCategories() {
        return Category.find({}).select('-__v').lean()
            .then(categories => {
                categories.forEach(category => {
                    category.id = category._id
                    delete category._id
                })
                return categories
            })
    },

    createCategory(data) {
        let category = new Category({ ...data })
        return category.save()
            .then(category => {
                return Category.findById(category._id).select('-__v').lean()
                    .then(category => {
                        category.id = category._id
                        delete category._id
                        return category
                    })
            })
            .catch(({ message }) => {
                throw Error(message)
            })
    }
}

module.exports = logic