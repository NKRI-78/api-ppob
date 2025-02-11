const axios = require('axios')

const misc = require("../helpers/response")
const Invoice = require('../models/Invoice')

module.exports = {

    payPulsa: async (req, res) => {
        const { orderId, status } = req.body 

        try {

            var invoices = await Invoice.findByValue(orderId)

            if(invoices.length == 0)
                throw new Error("Inovice not found")

            var product = invoices[0].product
            var idpel = invoices[0].idpel

            var data = {
                "method":"bayar",
                "uid": process.env.RAJABILLER_UID,
                "pin": process.env.RAJABILLER_PIN,
                "produk": product,
                "idpel": idpel,
                "ref1":""
            }

            var url = process.env.RAJABILLER_PROD
        
            var config = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            }

            if(status == "PAID") {
                const response = await axios(config)

                if(response.status == 200) {
                    if(typeof response.data != "undefined" && response.data.error)
                        throw new Error(response.data.error);

                    if(response.data.rc !== "00") {
                        misc.response(res, 400, true, response.data.status)
                    } else {
                        misc.response(res, 200, false, response.data.status)
                    }
                } else {
                    if(typeof response.data != "undefined") {
                        throw new Error(response.data.error)
                    } else {
                        throw new Error('Oops! Please try again later')
                    }
                } 
            }

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}