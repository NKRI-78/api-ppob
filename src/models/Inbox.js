const conn = require('../configs/db')

module.exports = {

    getInboxByUser: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM inboxes WHERE user_id = ?`
            const values = [userId]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    storeInbox: (title, description, field1, field2, origin, link) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT inboxes (title, description, field1, field2, origin, link) VALUES (?, ?, ?, ?, ?, ?)`

            var values = [title, description, field1, field2, origin, link]

            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}