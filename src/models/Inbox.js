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

    getInboxById: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM inboxes WHERE id = ?`
            const values = [id]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateInbox: (id) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE inboxes SET is_read = ? WHERE id = ?`
            const values = [1, id]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateInboxByTransactionId: (transactionId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE inboxes SET field2 = ? WHERE field1 = ?`
            const values = ["PAID", transactionId]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    storeInbox: (title, description, field1, field2, origin, link, field4, field3, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT inboxes (title, description, field1, field2, origin, link, field4, field3, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

            var values = [title, description, field1, field2, origin, link, field4, field3, userId]

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