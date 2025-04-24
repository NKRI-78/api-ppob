const conn = require('../configs/db_payment')

module.exports = {

    getPaymentChannel: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM Channels WHERE fee IS NOT NULL AND paymentType = 'VIRTUAL_ACCOUNT'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}