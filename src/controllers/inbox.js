const misc = require("../helpers/response")
const Inbox = require('../models/Inbox')

module.exports = {

    getInbox: async (req, res) => {
        const { user_id } = req.body 

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            var inboxes = await Inbox.getInboxByUser(user_id)

            var data = []

            for (const i in inboxes) {
                var inbox = inboxes[i]

                data.push({
                    id: inbox.uid, 
                    title: inbox.title ?? "-",
                    description: inbox.description ?? "-",
                    field2: inbox.field2 ?? "-",
                    field3: inbox.field3 ?? "-",
                    link: inbox.link ?? "-",
                    is_read: inbox.is_read == 0 
                    ? false 
                    : true
                })
            }

            misc.response(res, 200, false, "", data)

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    detailInbox: async (req, res) => {
        const { id } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("Field id is required")

            var inboxes = await Inbox.getInboxById(id)

            await Inbox.updateInbox(id)

            var data = []

            for (const i in inboxes) {
                var inbox = inboxes[i]

                data.push({
                    id: inbox.uid, 
                    title: inbox.title ?? "-",
                    description: inbox.description ?? "-",
                    field2: inbox.field2 ?? "-",
                    field3: inbox.field3 ?? "-",
                    link: inbox.link ?? "-",
                    is_read: inbox.is_read == 0 
                    ? false 
                    : true
                })
            }

            misc.response(res, 200, false, "", data)

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}