const connMarlinda = require('../configs/db_marlinda')

module.exports = {

    getProfile: (userId, appName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM profiles WHERE user_id = ?`
            var values = [userId]

            if(appName== "marlinda") {
                connMarlinda.query(query, values, (e, result) => {
                    if (e) {
                        reject(new Error(e))
                    } else {
                        resolve(result)
                    }
                })
            }
        })
    },

}