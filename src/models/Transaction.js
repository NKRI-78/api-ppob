const conn = require('../configs/db')

module.exports = {

    insert: (app, id, userId) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO transactions (app_id, uid, user_id) VALUES (?, ?, ?)`
            const values = [app, id, userId]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    findByTransactionId: (transactionId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT user_id FROM transactions WHERE uid = ?`
            const values = [transactionId]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM transactions WHERE uid = ?`
            const values = [id]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}