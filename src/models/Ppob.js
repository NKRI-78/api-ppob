const conn = require('../configs/db')

module.exports = {

    priceListPulsaData: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, product_code, product_price, product_name 
            FROM pricelists`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    priceListPlnPrabayar: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, product_code, product_price, product_name 
            FROM pricelist_prabayar_plns`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}