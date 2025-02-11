const misc = require("../helpers/response")
const Payment = require("../models/Payment")

const moment = require("moment")

const { v4: uuidv4 } = require('uuid')
const Transaction = require("../models/Transaction")
const Invoice = require("../models/Invoice")
const Ppob = require("../models/Ppob")

module.exports = {

    channel: async (_, res) => {
        try {
            var data = await Payment.getPaymentChannel()

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "", data)
        }
    },

    inquiry: async (req, res) => {
        const { app, idpel, user_id, product_id, payment_code, payment_channel, type } = req.body

        var transactionId = uuidv4()

        try {

            if(typeof app == "undefined" || app == "")
                throw new Error("Field app is required")

            if(typeof idpel == "undefined" || idpel == "")
                throw new Error("Field idpel is required")

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            if(typeof product_id == "undefined" || product_id == "")
                throw new Error("Field product_id = is required")

            if (typeof payment_code == "undefined" || payment_code == "")
                throw new Error("Field payment_code is required")

            if(typeof payment_channel == "undefined" || payment_channel == "")
                throw new Error("Field payment_channel is required")

            if(typeof type == "undefined" || type == "")
                throw new Error("Field type is required")

            var products = await Ppob.getPriceByProductId(product_id)

            var amount = products.length == 0 
            ? 0
            : products[0].product_price 

            var callbackUrl = type == "PULSA" 
            ? procces.env.CALLBACK_PAY_PULSA 
            : process.env.CALLBACK_PAY_PLN

            const invoiceDate = moment().format('YYYYMMDD')

            const invoiceData = await Invoice.invoice(invoiceDate)

            var counterNumber = 1

            if (invoiceData.length != 0)
                counterNumber = parseInt(invoiceData[0].no) + 1

            var invoiceValue = `PPOB_${type}-` + invoiceDate + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000)

            await Transaction.insert(app, transactionId, user_id)

            await Invoice.insert(invoiceDate, counterNumber, invoiceValue, transactionId, idpel, product_id)

            var data = {
                channel_id: payment_channel,
                orderId: invoiceValue,
                amount: amount, 
                app: "marlinda",
                callbackUrl: callbackUrl
            }

            var config = {
                method: 'POST',
                url: process.env.PAY_MIDTRANS,
                data: data
            }

            const result = await axios(config)

            var paymentAccess
            var paymentType

            if(payment_code == "gopay" || payment_code == "shopee" || payment_code == "ovo" || payment_code == "dana") {
                paymentAccess = result.data.data.data.actions[0].url
                paymentType = "emoney"
            } else {
                paymentAccess = result.data.data.data.vaNumber
                paymentType = "va"
            }
            
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)

            await Transaction.delete(transactionId)

            await Invoice.delete(transactionId)

            if (typeof e.response != "undefined")
                misc.response(res, 400, true, e.response.data.message)
            else
                misc.response(res, 400, true, e)

        }
    },

}