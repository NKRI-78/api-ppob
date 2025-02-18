const misc = require("../helpers/response");
const Admin = require('../models/Admin');
const Invoice = require("../models/Invoice");
const Profile = require("../models/Profile");
const Transaction = require("../models/Transaction");

module.exports = {

    infoPayment: async (_, res) => {
        try {
            var data = []
    
            const payments = await Admin.getPayment()

            // {
            //     "user": [
            //         {
            //             "fullname": "RAHMAD FANI",
            //             "address": "Daerah Khusus Ibukota Jakarta Kota Jakarta Selatan\nJl. Kemang Selatan IX No.47 C, Indonesia"
            //         }
            //     ],
            //     "order_id": "PPOB-PULSA-20250218-88998",
            //     "gross_amount": 52000,
            //     "total_amount": 53500,
            //     "transaction_status": "expire",
            //     "created_at": "2025-02-18T07:55:38.000Z"
            // }
    
            data = await Promise.all(payments.map(async (payment) => {
                const transactionId = payment.orderId
    
                const invoices = await Invoice.findByValue(transactionId)

                for (const i in invoices) {
                    var invoice = invoices[i]

                    var transaction = await Transaction.findByTransactionId(invoice.transaction_id)

                    const profile = await Profile.getProfile(transaction.user_id, transaction.name)
                    
                    console.log(profile)
                }

                // const transactions = await Promise.all(invoices.map((invoice) => { 
                //     Transaction.findByTransactionId(invoice.transaction_id)
                // }));

                // const flattenedTransactions = transactions.flat()
    
                // const userData = await Promise.all(flattenedTransactions.map(async (transaction) => {
                //     const profiles = await Profile.getProfile(transaction.user_id, transaction.name)
                //     return profiles.map(profile => ({
                //         fullname: profile.fullname,
                //         address: profile.address,
                //     }))
                // }))

                // const flattenedUserData = userData.flat()
    
                return {
                    user: [],
                    order_id: payment.orderId,
                    gross_amount: parseInt(payment.grossAmount),
                    total_amount: parseInt(payment.totalAmount),
                    transaction_status: payment.transactionStatus,
                    created_at: payment.createdAt
                }
            }))
    
            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.error(e);
            misc.response(res, 400, true, e.message)
        }
    },
    

}