const express = require("express")
const Route = express.Router()
const ppob = require("../controllers/ppob")

const jwt = require('../helpers/jwt')

Route
    .get("/info/price-list-pulsa-data", ppob.priceListPulsaData)
    .get("/info/price-list-pln-prabayar", ppob.priceListPlnPrabayar)
    .post("/pay/pulsa", jwt, ppob.payPulsa)

module.exports = Route