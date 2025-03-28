const express = require("express")

const ppob = require("./routes/ppob")
const payment = require("./routes/payment")
const callback = require("./routes/callback")
const inbox = require("./routes/inbox")
const admin = require("./routes/admin")

const Route = express.Router()

Route
    .use("/api/v1/ppob", ppob)
    .use("/api/v1/callback", callback)
    .use("/api/v1/inbox", inbox)
    .use("/api/v1/admin", admin)
    .use("/api/v1/payment", payment)

module.exports = Route