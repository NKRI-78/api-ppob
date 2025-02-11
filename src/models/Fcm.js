const connMarlinda = require('../configs/db_marlinda')

module.exports = {

    getFcm: (userId, app) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT token FROM fcms WHERE user_id = '${userId}'`

            if(app == "marlinda") {
                connMarlinda.query(query, (e, result) => {
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