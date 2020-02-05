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

  if (user_id === null || user_id === undefined || user_id === "") {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    branch_id === null ||
    branch_id === undefined ||
    branch_id === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    mer_authen_level === null ||
    mer_authen_level === undefined ||
    mer_authen_level === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    member_code === null ||
    member_code === undefined ||
    member_code === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    carrier_id === null ||
    carrier_id === undefined ||
    carrier_id === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    total === null ||
    total === undefined ||
    total === "" ||
    total === 0
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (img_url === null || img_url === undefined || img_url === "") {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    sender_name === null ||
    sender_name === undefined ||
    sender_name === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    sender_phone === null ||
    sender_phone === undefined ||
    sender_phone === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    sender_address === null ||
    sender_address === undefined ||
    sender_address === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (items.length === 0 || items == undefined) {
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

        var item_valid = true;
        for (i = 0; i < items.length; i++) {
          if (
            items[i].tracking === undefined || 
            items[i].tracking === null ||
            items[i].tracking === ""
          ) {
            item_valid = false;
          }
          if (
            items[i].parcel_type === undefined ||
            items[i].parcel_type === null ||
            items[i].parcel_type === ""
          ) {
            item_valid = false;
          }
          if (
            items[i].zipcode === undefined ||
            items[i].zipcode === null ||
            items[i].zipcode === ""
          ) {
            item_valid = false;
          }
          if (
            items[i].size_price === undefined ||
            items[i].size_price === null ||
            items[i].size_price === "" ||
            parseInt(items[i].size_price) === 0
          ) {
            item_valid = false;
          }
          if (
            items[i].cod_value === undefined || 
            items[i].cod_value === null ||
            items[i].cod_value === "" ||
            parseInt(items[i].cod_value) === 0
          ) {
            item_valid = false;
          }
          if (
            items[i].size_id === undefined || 
            items[i].size_id === null ||
            items[i].size_id === "" ||
            parseInt(items[i].size_id) === 0
          ) {
            item_valid = false;
          }
          if (
            items[i].parcel_type.toUpperCase() == "NORMAL" &&
            parseInt(items[i].cod_value) !== 0
          ) {
            item_valid = false;
          }
          if (
            items[i].parcel_type.toUpperCase() == "COD" &&
            parseInt(items[i].cod_value) === 0
          ) {
            item_valid = false;
          }
        }
        if (item_valid == false) {
          res.json({ status: "error_validate_tracking" });
        } else {
          var responseCheckItem = [];
          async function checkItem() {
            await items.forEach(async val => {
              responseCheckItem.push(quicklinkService.checkItem(val.tracking));
            });
            return await Promise.all(responseCheckItem);
          }
          checkItem().then(function(result) {
            var item_pass = true;
            for (j = 0; j < result.length; j++) {
              if (result[j] == undefined) {
                item_pass = false;
              }
            }
            // console.log(item_pass);
            if (item_pass == false) {
              res.json({ status: "error_no_data" });
            } else {
              for (q = 0; q < result.length; q++) {
                trackings.push(result[q][0]);
              }
              var data2 = {
                trackingList: trackings
              };
              request(
                {
                  url: "https://www.945api.com/parcel/check/tracking/list/api",
                  method: "POST",
                  body: data2,
                  json: true
                },
                (err, res3, body) => {

                  if (err === null) {
                    if (res3.body.status != true) {
                      res.json({ status: res3.body.status });
                    } else {
                      console.log("pass begin", billing_no);

                      async function updateItem() {
                        var resItem = [];

                        await items.forEach(async val => {
                          var trackingItem = val.tracking;
                          var zipcodeItem = val.zipcode;
                          var parcelTypeItem = val.parcel_type.toUpperCase();
                          var sizePriceItem = val.size_price;
                          var codValueItem = val.cod_value;
                          var sizeIdItem = val.size_id;

                          resItem.push(quicklinkService.checkTrackingBillingItem(billing_no,sender_name,sender_phone,sender_address,source,trackingItem,zipcodeItem,parcelTypeItem,sizePriceItem,codValueItem,sizeIdItem));
                        });
                        var resultArr = await Promise.all(resItem);
                        return resultArr;
                      }
                      updateItem().then(function(result) {
                        async function dataProcess(rtArr) {
                          let c_pass = true;
                          for (i = 0; i < rtArr.length; i++) {
                            if (typeof rtArr[i] == "undefined") {
                              c_pass = false;
                            }
                          }
                          if (c_pass) {
                            let resultBilling = await quicklinkService.saveQuicklinkBilling(rtArr[0],user_id,mer_authen_level,member_code,carrier_id,billing_no,branch_id,total,img_url);
                            return resultBilling;
                          } else {
                            return false;
                          }
                        }

                        dataProcess(result).then(data => {
                          if (data === false) {
                            res.json({
                              status: "error"
                            });
                          } else {
                            quicklinkService.updateStatusBilling(billing_no).then(function(resBilling) {
                                if (resBilling.affectedRows > 0) {
                                  res.json({
                                    status: "success",
                                    billing_no: billing_no
                                  });
                                }
                              });
                          }
                        });
                      });
                    }
                  }
                }
              );
            }
          });
        }
      }
    );
  }
});

module.exports = app;
