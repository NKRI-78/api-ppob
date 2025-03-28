const conn = require('../configs/db_payment')

module.exports = {

    getPayment: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM Payments WHERE orderId LIKE 'PPOB%'`
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