const conn = require('../configs/db')

module.exports = {

    invoice: (invoiceDate) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT * FROM invoices WHERE date_value = ? ORDER BY no DESC LIMIT 1`
            const values = [invoiceDate]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    findByValue: (value) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT * FROM invoices WHERE value = ? ORDER BY no DESC LIMIT 1`
            const values = [value]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insert: (invoiceDate, counterNumber, invoiceValue, transactionId, idpel, product) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO invoices (no, value, date_value, transaction_id, product, idpel) 
            VALUES (?, ?, ?, ?, ?, ?)`
            const values = [counterNumber, invoiceValue, invoiceDate, transactionId, product, idpel]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (transactionId) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM invoices WHERE transaction_id = ?`
            const values = [transactionId]
            conn.query(query, values, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}