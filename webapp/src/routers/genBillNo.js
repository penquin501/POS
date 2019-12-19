const app = require("express").Router();
const genBillingNoServices = require("../services/genBillNoServices.js");
// const connection = require("../common/db945.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
moment.locale("th");

app.post("/parcelPrice", (req, res) => {
  let zipcode = req.body.zipcode;
  let size_name = req.body.size_name;
  genBillingNoServices.checkDistrict(zipcode).then(function(data, error) {
    if (data == false) {
      res.json({ results: false });
    } else {
      let district = data[0].district_code;
      let code;
      let districtConvert = parseInt(district[0] + district[1]);
      if (zipcode == "13180") {
        code = "upc";
      } else if (districtConvert >= 10 && districtConvert < 14) {
        code = "bkk";
      } else {
        code = "upc";
      }
      genBillingNoServices.checkPrice(code, size_name).then(function(data) {
        res.json(data);
      });
    }
  });
});

app.get("/checkSenderMember", (req, res) => {
  let phone_number = req.query.phone;
  let tracking = req.query.tracking;
  let status;

  let trackings = [];
  var trackingItem = {
    tracking: tracking
  };
  trackings.push(trackingItem);
  var data2 = {
    trackingList: trackings
  };
  request(
    {
      // url: "https://apidev.whatitems.com/parcel/check/tracking/list/api",
      url: "https://www.945api.com/parcel/check/tracking/list/api",
      method: "POST",
      body: data2,
      json: true
    },
    (err, res2, body) => {
      if (res2.body.status != true) {
        res.json({ status: res2.body.status });
      } else {
        genBillingNoServices.checkSenderMember(tracking).then(function(dataCapture) {
            genBillingNoServices.checkTrackingBillItem(tracking).then(function(dataBillItem) {
                let phoneCapture;
                if (dataCapture == false) {
                  status = "Error_Not_In_Capture_Data";
                } else {
                  phoneCapture = dataCapture[0].phone_number;
                  if (phoneCapture != phone_number) {
                    status = "Error_Phone_Not_Match";
                  } else if (dataBillItem == false) {
                    status = "Error_Tracking_Cannot_Use";
                  } else {
                    status = "Success";
                  }
                  var output = {
                    status: status
                  };
                  res.json(output);
                }
              });
          });
      }
    }
  );
});

app.post("/genBillingNumber", (req, res) => {
  let branch_id = req.body.branch_id;
  let user_id = req.body.user_id;
  let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
  let dateBillingNo = moment(dateNow).format("YYMMDDHHmmss", true);
  let randomNo = Math.floor(Math.random() * (999 - 111)) + 111;

  let billing_no = branch_id + "-" + user_id + "-" + dateBillingNo + "-" + randomNo;
  res.json(billing_no);
});

app.get("/getReceipt", (req, res) => {
  let bill = req.query.bill;

  genBillingNoServices.getReceipt(bill).then(function(data) {
    // console.log("router data",data.billingInfo[0].member_code);
    genBillingNoServices.getType(bill).then(function(data2) {
      var dataJson = {
        member_code: data.billingInfo[0].member_code
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
          if (data == false || data2 == false) {
            res.json({
              status: "ERROR_NO_BILL_NO"
            });
          } else {
            res.json({
              status: "SUCCESS",
              billing_no: data.billingInfo[0].billing_no,
              total: data.billingInfo[0].total,
              member_code: data.billingInfo[0].member_code,
              member_name: res2.body.memberInfo.firstname + " " +res2.body.memberInfo.lastname,
              branch_id: data.billingInfo[0].branch_id,
              branch_name: data.billingInfo[0].branch_name,
              timestamp: data.billingInfo[0].timestamp,
              billing_date: data.billingInfo[0].billing_date.toISOString().replace(/T/, ' ').replace(/\..+/, ''),

              listTracking: data.billingItem,
              summary: data2
            });
          }
        }
      );
    });
  });
});

app.get("/checkZipcode", (req, res) => {
  let zipcode = req.query.zipcode;
  genBillingNoServices.checkZipcode(zipcode).then(function(data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
});

module.exports = app;
