const misc = require("../helpers/response")
const Payment = require("../models/Payment")

const moment = require("moment")

const { v4: uuidv4 } = require('uuid')

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
        const { user_id, payment_code, payment_channel } = req.body

        var transactionId = uuidv4()

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id is required")

            if (typeof payment_code == "undefined" || payment_code == "")
                throw new Error("payment_code is required")

            if(typeof payment_channel == "undefined" || payment_channel == "")
                throw new Error("payment_channel is required")

            var totalAmount = 0

            const invoiceDate = moment().format('YYYYMMDD')

            const invoiceData = await Invoice.invoice(invoiceDate)

            var counterNumber = 1

            if (invoiceData.length != 0)
                counterNumber = parseInt(invoiceData[0].no) + 1

            var invoiceValue = 'PPOB-' + invoiceDate + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000)

            await Transaction.insert(transactionId, user_id)

            await Invoice.insert(invoiceDate, counterNumber, invoiceValue, transactionId)

            var payloadMidtrans = {
                channel_id: payment_channel,
                orderId: invoiceValue,
                amount: totalAmount, 
                app: "marlinda",
                callbackUrl: process.env.CALLBACK_URL_MIDTRANS
            }

            var config = {
                method: 'POST',
                url: process.env.PAY_MIDTRANS,
                data: payloadMidtrans
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