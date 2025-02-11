const express = require("express")
const Route = express.Router()
const payment = require("../controllers/payment")

Route
    .get("/", payment.channel)

module.exports = Route