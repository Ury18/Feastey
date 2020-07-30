const Test = require("./test")
const VerifyEmail = require("./verify-email")
const ChangePassword = require("./change-password")
const PaymentSucceeded = require("./payment-succeeded")
const PaymentFailed = require("./payment-failed")

// VerifyEmail.send({ to: "ury_98@hotmail.com", verifyUrl:"https://ury.feastey.com/business"})

module.exports = { Test, VerifyEmail, ChangePassword, PaymentSucceeded, PaymentFailed }
