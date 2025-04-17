const connMarlinda = require('../configs/db_marlinda')
const connLingkunganku = require('../configs/db_lingkunganku')
const connAtj = require('../configs/db_atj')

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

            if(app == "atj") {
                query = `SELECT fcm AS token FROM users WHERE id = '${userId}'`

                connAtj.query(query, (e, result) => {
                    if (e) {
                        reject(new Error(e))
                    } else {
                        resolve(result)
                    }
                })
            }

            if(app == "lingkunganku") {

                query = `SELECT fcm_token AS token FROM Users WHERE id = '${userId}'`

                connLingkunganku.query(query, (e, result) => {
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