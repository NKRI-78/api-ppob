const misc = require("../helpers/response");
const Admin = require('../models/Admin');
const Invoice = require("../models/Invoice");
const Profile = require("../models/Profile");
const Transaction = require("../models/Transaction");

module.exports = {

    infoPayment: async (req, res) => {
        try {
            let data = [];
    
            // Fetch all payments
            const payments = await Admin.getPayment();
    
            // Process payments in parallel
            data = await Promise.all(payments.map(async (payment) => {
                const transactionId = payment.orderId;
    
                // Fetch all invoices for the payment
                const invoices = await Invoice.findByValue(transactionId);
    
                // Fetch transactions in parallel
                const transactions = await Promise.all(invoices.map(invoice => 
                    Transaction.findByTransactionId(invoice.transaction_id)
                ));
    
                // Flatten the transactions array
                const flattenedTransactions = transactions.flat();
    
                // Fetch user profiles in parallel
                const userData = await Promise.all(flattenedTransactions.map(async (transaction) => {
                    const profiles = await Profile.getProfile(transaction.user_id, transaction.name);
                    return profiles.map(profile => ({
                        fullname: profile.fullname,
                        address: profile.address
                    }));
                }));
    
                // Flatten userData array
                const flattenedUserData = userData.flat();
    
                return {
                    user: flattenedUserData,
                    order_id: payment.orderId,
                    gross_amount: parseInt(payment.grossAmount),
                    total_amount: parseInt(payment.totalAmount),
                    transaction_status: payment.transactionStatus,
                    created_at: payment.createdAt
                };
            }));
    
            misc.response(res, 200, false, "", data);
        } catch (e) {
            console.error(e);
            misc.response(res, 400, true, e.message);
        }
    },
    

}