const BusinessLogic = require('../models/business/logic')


function test(businessId,owner) {
    BusinessLogic.generateBusinessQrById(businessId,owner)
}

module.exports = test



