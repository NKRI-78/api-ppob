const conn = require('../configs/db')

module.exports = {

    priceListPulsaData: (prefix) => {
        return new Promise((resolve, reject) => {
            var whereClause = ""

            console.log(prefix)

            if(prefix == "62895" || prefix == "62896" || prefix == "62897" || prefix == "62898" || prefix == "62899") {
                whereClause += `WHERE prefix = 'THREE'`
            }

            if(prefix == "62811" || prefix == "62812" || prefix == "62813" || prefix == "62821" 
                ||  prefix == "62822" || prefix == "62821" || prefix == "62822" || prefix == "62851" 
                || prefix == "62852" || prefix == "62853") {
                whereClause += `WHERE prefix = 'TELKOMSEL'`
            }

            if(prefix == "62817" || prefix == "62818" || prefix == "62819" || prefix == "62859" || prefix == "62877" || prefix == "62878") {
                whereClause += `WHERE prefix = 'AXIS/XL' OR prefix = 'XLREG'` 
            }

            if(prefix == "62855" || prefix == "62856" || prefix == "62857" || prefix == "62858") {
                whereClause += `WHERE prefix = 'INDOSAT'`
            }

            var query = `SELECT uid, product_code, product_price, product_name 
            FROM pricelists ${whereClause}`

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