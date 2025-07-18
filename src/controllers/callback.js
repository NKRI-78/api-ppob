const axios = require("axios");

const misc = require("../helpers/response");
const Invoice = require("../models/Invoice");
const Inbox = require("../models/Inbox");
const Transaction = require("../models/Transaction");
const Fcm = require("../models/Fcm");
const utils = require("../helpers/utils");

module.exports = {
  payPulsa: async (req, res) => {
    const { order_id, status } = req.body;

    try {
      var invoices = await Invoice.findByValue(order_id);

      if (invoices.length == 0) throw new Error("Invoice not found");

      var transactionId = invoices[0].transaction_id;
      var app = invoices[0].app;
      var product = invoices[0].product;
      var idpel = invoices[0].idpel;

      var transaction = await Transaction.findByTransactionId(
        transactionId,
        app
      );

      var userId = transaction.user_id ?? "-";

      var data = {
        method: "bayar",
        uid: process.env.RAJABILLER_UID,
        pin: process.env.RAJABILLER_PIN,
        produk: product,
        idpel: idpel,
        ref1: "",
      };

      var url = process.env.RAJABILLER_PROD;

      var config = {
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      if (status == "PAID") {
        const response = await axios(config);

        if (response.status == 200) {
          if (typeof response.data != "undefined" && response.data.error)
            throw new Error(response.data.error);

          await Inbox.updateInboxByTransactionId(transactionId);

          if (response.data.rc !== "00") {
            var fcms = await Fcm.getFcm(userId, app);

            for (const i in fcms) {
              var fcm = fcms[i];
              var token = fcm.token;

              await utils.sendFCM(
                "Pembayaran belum berhasil",
                response.data.status,
                token,
                "ppob"
              );
            }
            throw new Error(response.data.status);
          } else {
            var fcms = await Fcm.getFcm(userId, app);

            for (const i in fcms) {
              var fcm = fcms[i];
              var token = fcm.token;

              await utils.sendFCM(
                "Pembayaran berhasil",
                "Terima kasih sudah menggunakan layanan kami",
                token,
                "ppob"
              );
            }
            misc.response(res, 200, false, response.data.status);
          }
        } else {
          if (typeof response.data != "undefined") {
            var fcms = await Fcm.getFcm(userId, app);

            for (const i in fcms) {
              var fcm = fcms[i];
              var token = fcm.token;

              await utils.sendFCM(
                "Pembayaran belum berhasil",
                response.data.error,
                token,
                "ppob"
              );
            }
            throw new Error(response.data.error);
          } else {
            throw new Error("Oops! Please try again later");
          }
        }
      }
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
