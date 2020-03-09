const app = require("express").Router();
// const escpos = require('escpos');
const moment = require("moment");
const request = require("request");
const momentTimezone = require("moment-timezone");
const genBillingNoServices = require("../services/genBillNoServices.js");

app.get("/printBillPdf", (req, res) => {
  let bill = req.query.bill;

  genBillingNoServices.getReceipt(bill).then(function(data) {
    console.log("print receipt ==>",data.data.billingInfo[0].billing_no);
    var dataJson = {
      member_code: data.billingInfo[0].member_code
    };
    request(
      {
        url: "https://www.945api.com/parcel/select/member/api",
        method: "POST",
        body: dataJson,
        json: true
      },
      (err, res2, body) => {
        if (err === null) {
          genBillingNoServices.getType(bill).then(function(data2) {
            var timestamp = momentTimezone(data.billingInfo[0].billing_date).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss", true);
            var dateConvert = formatDateToThai(timestamp);
            var total =0

            for(i=0;i<data.billingItem.length;i++){
              total+=data.billingItem[i].size_price;
            }

            var datatest = {
              data: data,
              total:total,
              member_code:
                res2.body.memberInfo.firstname + " " +res2.body.memberInfo.lastname,
              datatime: dateConvert,
              data2: data2
            };
            res.render("bill.twig", datatest);
          });
        }
      }
    );
  });
});

app.get("/printMemberBillPdf", (req, res) => {
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
              .then(function(data2) {
                // var timestamp = parseInt(data[0].timestamp);
                // var dateConvert = formatDateToThai(parseInt(timestamp))
                var datatest = {
                  data: data,
                  member_code: member_name,
                  // 'datatime': dateConvert,
                  data2: data2
                };

                res.render("billMember.twig", datatest);
              });
          }
        }
      );
    });
});

function formatDateToThai(date) {
  var year = moment(date).format("YYYY");
  var year2 = parseInt(year) + 543;
  return moment(date).format(" Do MMMM " + year2 + " " + "H:mm");
}

module.exports = app;
