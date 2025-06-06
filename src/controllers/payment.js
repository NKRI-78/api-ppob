const misc = require("../helpers/response")

const moment = require("moment-timezone")

const axios = require("axios")

const { v4: uuidv4 } = require('uuid')

const utils = require("../helpers/utils")

const Payment = require("../models/Payment")
const Transaction = require("../models/Transaction")
const Invoice = require("../models/Invoice")
const Ppob = require("../models/Ppob")
const Fcm = require("../models/Fcm")
const Inbox = require("../models/Inbox")
const App = require("../models/App")

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

            var productName = products.length == 0 
            ? 0
            : products[0].product_name 
            var amount = products.length == 0 
            ? 0
            : products[0].product_price 

            var callbackUrl = type == "PULSA" 
            ? process.env.CALLBACK_PAY_PULSA 
            : process.env.CALLBACK_PAY_PLN

            const invoiceDate = moment().format('YYYYMMDD')

            const invoiceData = await Invoice.invoice(invoiceDate)

            var counterNumber = 1

            if (invoiceData.length != 0)
                counterNumber = parseInt(invoiceData[0].no) + 1

            var invoiceValue = `PPOB-${type}-` + invoiceDate + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000)

            var apps = await App.getAppById(app)
            
            var appId = apps.length == 0 
            ? -1 
            : apps[0].id
            var appName = apps.length == 0 
            ? -1 
            : apps[0].name

            await Transaction.insert(appId, transactionId, user_id)

            await Invoice.insert(invoiceDate, counterNumber, invoiceValue, transactionId, idpel, product_id)

            var titleInbox = `Terima kasih ! telah melakukan transaksi ${productName}`
            var descInbox = amount

            if(app != "pgb") {
                var fcms = await Fcm.getFcm(user_id, app)

                for (const i in fcms) {
                    var fcm = fcms[i]
                    var token = fcm.token
                    
                    await utils.sendFCM(titleInbox, `Silahkan periksa halaman notifikasi untuk info pembayaran`, token, "ppob")
                }
            }

            var data = {
                channel_id: payment_channel,
                orderId: invoiceValue,
                amount: parseInt(amount), 
                app: appName,
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
            var paymentExpire

            if(payment_code == "gopay" || payment_code == "shopee" || payment_code == "ovo" || payment_code == "dana") {
                paymentAccess = result.data.data.data.actions[0].url
                paymentType = "emoney"

                paymentExpire =  moment().tz("Asia/Jakarta").add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')
            } else {
                paymentAccess = result.data.data.data.vaNumber
                paymentType = "va"
                paymentExpire = result.data.data.expire 
            }

            await Inbox.storeInbox(
                titleInbox, 
                utils.formatCurrency(descInbox), 
                transactionId, "UNPAID", app, 
                paymentAccess, paymentExpire, 
                payment_code, paymentType, invoiceValue, idpel, user_id
            )
            
            misc.response(res, 200, false, "", {
                payment_access: paymentAccess,
                payment_type: paymentType,
                order_id: invoiceValue,
                payment_expire: paymentExpire
            })
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