const misc = require("../helpers/response")
const Inbox = require('../models/Inbox')

module.exports = {

    getInbox: async (req, res) => {
        const { user_id } = req.body 

        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("User not found")

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
    }

}