const express = require("express")

const ppob = require("./routes/ppob")

const Route = express.Router()

Route
    .use("/api/v1/ppob", ppob)

module.exports = Route