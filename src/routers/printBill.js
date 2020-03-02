const app = require("express").Router();
const moment = require("moment");
const path = require("path");
const numeral = require("numeral");
const request = require("request");
const genBillingNoServices = require("../services/genBillNoServices.js");
moment.locale("th");

app.get("/printBillAll", (req, res) => {
  let bill = req.query.bill;
  genBillingNoServices.getReceipt(bill).then(function(dataReceipt) {
    if (dataReceipt[0].billing_no == undefined) {
      res.end("err");
    }
    var dataJson = {
      member_code: dataReceipt[0].member_code
    };
    request(
      {
        // url: "https://apidev.whatitems.com/parcel/select/member/api",
        url: "https://www.945api.com/parcel/select/member/api",
        method: "POST",
        body: dataJson,
        json: true
      },
      (err, res2, body) => {
        if (err === null) {
          var member_name =
            res2.body.memberInfo.firstname +
            " " +
            res2.body.memberInfo.lastname;
          var billing_no = dataReceipt[0].billing_no;
          var total = dataReceipt[0].total;
          var first_name = member_name;
          var member_code = dataReceipt[0].member_code;
          var branch_id = dataReceipt[0].branch_id;
          var branch_name = dataReceipt[0].branch_name;
          var timestamp = dataReceipt[0].timestamp;
          for (i = 0; i < dataReceipt.length; i++) {
            var tracking = dataReceipt[i].tracking;
            var size_price = dataReceipt[i].size_price;
            var parcel_type = dataReceipt[i].parcel_type;
            var alias_size = dataReceipt[i].alias_size;
            var receiver_name = dataReceipt[i].receiver_name;
            var province_name = dataReceipt[i].province_name;
            var zipcode = dataReceipt[i].zipcode;
            var cod_value = dataReceipt[i].cod_value;
            var count = dataReceipt.length;
            genBillingNoServices
              .savePrintBill(
                billing_no,
                total,
                first_name,
                member_code,
                branch_id,
                branch_name,
                timestamp,
                tracking,
                size_price,
                parcel_type,
                alias_size,
                receiver_name,
                province_name,
                zipcode,
                cod_value,
                count
              )
              .then(function(data) {});
          }
        }
      }
    );

    res.end("success");
  });
});

app.get("/printBillMember", (req, res) => {
  let member_code = req.query.member_code;
  let branch_id = req.query.branch_id;
  genBillingNoServices
    .getReceiptMember(member_code, branch_id)
    .then(function(data) {
      var dataJson = {
        member_code: member_code
      };
      request(
        {
          // url: "https://apidev.whatitems.com/parcel/select/member/api",
          url: "https://www.945api.com/parcel/select/member/api",
          method: "POST",
          body: dataJson,
          json: true
        },
        (err, res2, body) => {
          if (err === null) {
            var member_name =
              res2.body.memberInfo.firstname +
              " " +
              res2.body.memberInfo.lastname;

            genBillingNoServices
              .getMemberBillType(member_code, branch_id)
              .then(function(data2) {});
          }
        }
      );
      res.end("success");
    });
});

module.exports = app;
