const axios = require('axios');

const misc = require("../helpers/response");
const Ppob = require("../models/Ppob");

module.exports = {

    priceListPulsaDataGeneral: async (req, res) => {
        const { prefix, type } = req.query

        try {
            if(typeof prefix == "undefined" || prefix == "")
                throw new Error("Param query prefix is required")

            if(typeof type == "undefined" || type == "")
                throw new Error("Param type is required")

            var types = ["PULSA", "DATA"]

            if (!types.includes(type.toUpperCase())) 
                throw new Error("Invalid type. Allowed values are: PULSA, DATA")

            var priceList = await Ppob.priceListPulsaDataGeneral(prefix, type)

            var data = []

            for (const i in priceList) {
                var priceItem = priceList[i]

                data.push({
                    id: priceItem.uid, 
                    code: priceItem.product_code,
                    price: parseInt(priceItem.product_price),
                    name: priceItem.product_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    priceListPulsaData: async (req, res) => {
        const { prefix, type } = req.query

        try {
            if(typeof prefix == "undefined" || prefix == "")
                throw new Error("Param query prefix is required")

            if(typeof type == "undefined" || type == "")
                throw new Error("Param type is required")

            var types = ["PULSA", "DATA"]

            if (!types.includes(type.toUpperCase())) 
                throw new Error("Invalid type. Allowed values are: PULSA, DATA")

            var priceList = await Ppob.priceListPulsaData(prefix, type)

            var data = []

            for (const i in priceList) {
                var priceItem = priceList[i]

                data.push({
                    id: priceItem.uid, 
                    code: priceItem.product_code,
                    price: parseInt(priceItem.product_price),
                    name: priceItem.product_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    priceListPlnPrabayar: async (_, res) => {
        try {
            var priceList = await Ppob.priceListPlnPrabayar()

            var data = []

            for (const i in priceList) {
                var priceItem = priceList[i]

                data.push({
                    id: priceItem.uid, 
                    code: priceItem.product_code,
                    price: parseInt(priceItem.product_price),
                    name: priceItem.product_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    payPulsa: async (req, res) => {
        const { idpel, product } = req.body 

        try {

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

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}