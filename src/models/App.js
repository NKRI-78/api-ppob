const conn = require('../configs/db')

module.exports = {

    getAppById: (app) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM apps WHERE name = ?`
            var values = [app]
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