const conn = require('../configs/db')

module.exports = {

    priceListPulsaData: (prefix, type) => {
        return new Promise((resolve, reject) => {
            const prefixMap = {
                "THREE": ["62895", "62896", "62897", "62898", "62899"],
                "TELKOMSEL": ["62811", "62812", "62813", "62821", "62822", "62851", "62852", "62853"],
                "AXIS/XL": ["62817", "62818", "62819", "62859", "62877", "62878"],
                "INDOSAT": ["62855", "62856", "62857", "62858"]
            };
    
            let operator = Object.keys(prefixMap).find(key => 
                prefixMap[key].some(p => prefix.startsWith(p))
            );
    
            if (!operator) {
                return resolve([]);
            }
    
            let whereClause = `WHERE prefix LIKE '${operator}%'`;
            if (operator === "AXIS/XL") {
                whereClause = `WHERE prefix IN ('AXIS/XL', 'XLREG')`;
            }
    
            const query = `SELECT uid, product_code, product_price, product_name FROM pricelists ${whereClause} AND type LIKE '%${type}%'`;

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e));
                } else {
                    resolve(result);
                }
            });
        });
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
    },

    getPriceByProductId: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, product_code, product_price, product_name 
                FROM pricelists 
                WHERE product_code = ?
                UNION 
                SELECT uid, product_code, product_price, product_name 
                FROM pricelist_prabayar_plns 
                WHERE product_code = ?
            `
            const values = [id, id]
            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}