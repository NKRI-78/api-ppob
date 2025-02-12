const express = require("express")
const Route = express.Router()
const inbox = require("../controllers/inbox")

Route
    .post("/", inbox.getInbox)

module.exports = Route