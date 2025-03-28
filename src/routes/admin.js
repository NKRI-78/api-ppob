const express = require("express")
const Route = express.Router()
const admin = require("../controllers/admin")

Route
    .get("/info/payment", admin.infoPayment)

module.exports = Route