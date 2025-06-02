const misc = require("../helpers/response");
const Admin = require('../models/Admin');
const Invoice = require("../models/Invoice");
const Profile = require("../models/Profile");
const Transaction = require("../models/Transaction");

module.exports = {

    infoPayment: async (_, res) => {
        try {
            const payments = await Admin.getPayment();
    
            const data = await Promise.all(payments.map(async (payment) => {
                const transactionId = payment.orderId;
                const invoices = await Invoice.findByValue(transactionId);
    
                if (!invoices || invoices.length === 0) {
                    return {
                        user: { fullname: "-" },
                        idpel: "-",
                        provider: "-",
                        order_id: payment.orderId,
                        gross_amount: parseInt(payment.grossAmount) || 0,
                        total_amount: parseInt(payment.totalAmount) || 0,
                        transaction_status: payment.transactionStatus ?? "-",
                        created_at: payment.createdAt ?? "-"
                    };
                }
    
                const invoice = invoices[0];
                
                // const transaction = await Transaction.findByTransactionId(invoice.transaction_id);
    
                // if (!transaction) {
                //     return {
                //         user: { fullname: "-" },
                //         idpel: invoice.idpel ?? "-",
                //         provider: invoice.product_name ?? "-",
                //         order_id: payment.orderId,
                //         gross_amount: parseInt(payment.grossAmount) || 0,
                //         total_amount: parseInt(payment.totalAmount) || 0,
                //         transaction_status: payment.transactionStatus ?? "-",
                //         created_at: payment.createdAt ?? "-"
                //     };
                // }
    
                // const profile = await Profile.getProfile(transaction.user_id, transaction.name);
    
                return {
                    user: { fullname: "-" },
                    idpel: invoice.idpel ?? "-",
                    provider: invoice.product_name ?? "-",
                    order_id: payment.orderId,
                    gross_amount: parseInt(payment.grossAmount) || 0,
                    total_amount: parseInt(payment.totalAmount) || 0,
                    transaction_status: payment.transactionStatus ?? "-",
                    created_at: payment.createdAt ?? "-"
                };
            }));
    
            misc.response(res, 200, false, "", data);
        } catch (e) {
            console.error(e);
            misc.response(res, 400, true, e.message);
        }
    },
    

}