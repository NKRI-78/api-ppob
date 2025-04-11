const express = require("express")
const Route = express.Router()
const inbox = require("../controllers/inbox")

Route
    .post("/", inbox.getInbox)
    .put("/update/allread", inbox.updateInboxAllRead)
    .post("/detail", inbox.detailInbox)

module.exports = Route