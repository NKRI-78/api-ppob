const misc = require("../helpers/response");
const Ppob = require("../models/Ppob");

module.exports = {

    priceListPulsaData: async (_, res) => {
        try {
            var priceList = await Ppob.priceListPulsaData()

            var data = []

            for (const i in priceList) {
                var priceItem = priceList[i]

                data.push({
                    id: priceItem.uid, 
                    code: priceItem.product_code,
                    price: priceItem.product_price,
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
                    price: priceItem.product_price,
                    name: priceItem.product_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}