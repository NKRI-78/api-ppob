const express = require("express")
const Route = express.Router()
const callback = require("../controllers/callback")

Route
    .post("/pay-pulsa", callback.payPulsa)

module.exports = Route