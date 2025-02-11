const conn = require('../configs/db')

module.exports = {

    getAppById: (appId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM apps WHERE id = ?`
            var values = [appId]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}