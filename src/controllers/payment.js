const misc = require("../helpers/response");
const Payment = require("../models/Payment");

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

}