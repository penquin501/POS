const app = require("express").Router();
const quicklinkService = require("../services/quicklinkService.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
const connection = require("../common/db.js");
var jsonParser = bodyParser.json();
moment.locale("th");

app.post("/quickLink", jsonParser, (req, res) => {
  var billing_no;
  let branch_id = req.body.branch_id;
  let user_id = req.body.user_id;
  let mer_authen_level = req.body.mer_authen_level;
  let member_code = req.body.member_code;
  let carrier_id = req.body.carrier_id;
  let total = req.body.total;
  let img_url = req.body.courier_image;
  let sender_name = req.body.sender_name;
  let sender_phone = req.body.sender_phone;
  let sender_address = req.body.sender_address;
  let items = req.body.items;
  var source = "QUICKLINK";
  let trackings = [];
  if (user_id === null || user_id === '') {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (branch_id === null || branch_id === '') {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (mer_authen_level === null|| mer_authen_level === '') {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else {
    var dataJson = {
      user_id: user_id,
      branch_id: branch_id
    };
    request(
      {
        url: "https://pos.945.report/genBillNo/genBillingNumber",
        method: "POST",
        body: dataJson,
        json: true
      },
      (err, res2, body) => {
        billing_no = res2.body;
        if (!items.length && items == undefined) {
          res.json({ status: "error_no_items" });
        } else {
          for (i = 0; i < items.length; i++) {
            var tracking = items[i].tracking;
            var trackingItem = {
              tracking: tracking
            };
            trackings.push(trackingItem);
          }
          var data2 = {
            trackingList: trackings
          };
          request(
            {
              //   url: "https://apidev.whatitems.com/parcel/check/tracking/list/api",
              url: "https://www.945api.com/parcel/check/tracking/list/api",
              method: "POST",
              body: data2,
              json: true
            },
            (err, res3, body) => {
              if (res3.body.status != true) {
                res.json({ status: res3.body.status });
              } else {
                quicklinkService
                  .saveQuicklinkBilling(
                    user_id,
                    mer_authen_level,
                    member_code,
                    carrier_id,
                    billing_no,
                    branch_id,
                    total,
                    img_url
                  )
                  .then(function(data) {});

                for (j = 0; j < items.length; j++) {
                  var trackingItem = items[j].tracking;
                  var zipcodeItem = items[j].zipcode;
                  var parcelTypeItem = items[j].parcel_type.toUpperCase();
                  var sizePriceItem = items[j].size_price;
                  var codValueItem = items[j].cod_value;
                  var sizeIdItem = items[j].size_id;

                  quicklinkService
                    .checkTrackingBillingItem(
                      billing_no,
                      sender_name,
                      sender_phone,
                      sender_address,
                      source,
                      trackingItem,
                      zipcodeItem,
                      parcelTypeItem,
                      sizePriceItem,
                      codValueItem,
                      sizeIdItem
                    )
                    .then(function(dataBillItem) {});
                }
                res.json({
                  status: "success",
                  billing_no: billing_no
                });
              }
            }
          );
        }
      }
    );
  }
});
module.exports = app;
