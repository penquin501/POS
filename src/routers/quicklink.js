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
  var c_total = 0;
  var regexPhone = /^0\d{9}$/;
  var regex_img = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

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
    parseInt(total) === 0
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    img_url === null ||
    img_url === undefined ||
    img_url === "" ||
    img_url.match(regex_img) === null
  ) {
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
    sender_phone === "" ||
    sender_phone.match(regexPhone) === null
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
          if (items[i].tracking === undefined) {
            item_valid = false;
          }
          if (items[i].tracking === null) {
            item_valid = false;
          }
          if (items[i].tracking === "") {
            item_valid = false;
          }
          if (items[i].parcel_type === undefined) {
            item_valid = false;
          }
          if (items[i].parcel_type === null) {
            item_valid = false;
          }
          if (items[i].parcel_type === "") {
            item_valid = false;
          }
          if (
            items[i].parcel_type.toUpperCase() !== "NORMAL" &&
            items[i].parcel_type.toUpperCase() !== "COD"
          ) {
            item_valid = false;
          }
          if (items[i].zipcode === undefined) {
            item_valid = false;
          }
          if (items[i].zipcode === null) {
            item_valid = false;
          }
          if (items[i].zipcode === "") {
            item_valid = false;
          }
          if (items[i].size_price === undefined) {
            item_valid = false;
          }
          if (items[i].size_price === null) {
            item_valid = false;
          }
          if (items[i].size_price === "") {
            item_valid = false;
          }
          if (parseInt(items[i].size_price) === 0) {
            item_valid = false;
          }
          if (items[i].cod_value === undefined) {
            item_valid = false;
          }
          if (items[i].cod_value === null) {
            item_valid = false;
          }
          if (items[i].cod_value === "") {
            item_valid = false;
          }
          if (items[i].size_id === undefined) {
            item_valid = false;
          }
          if (items[i].size_id === null) {
            item_valid = false;
          }
          if (items[i].size_id === "") {
            item_valid = false;
          }
          if (parseInt(items[i].size_id) === 0) {
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
            (parseInt(items[i].cod_value) <= 0 ||
              parseInt(items[i].cod_value) > 30000)
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
              responseCheckItem.push(
                quicklinkService.checkItem(
                  val.tracking,
                  val.zipcode,
                  val.size_id,
                  val.size_price
                )
              );
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
            if (item_pass == false) {
              /* error tracking ซ้ำ/ข้อมูล zipcode ผิด/size id กับราคาผิด  */
              res.json({ status: "error_data/no_capture/wrong_zipcode/wrong_parcel_price/wrong_area_for_sd" });
            } else {
              let c_total = 0;
              for (r = 0; r < items.length; r++) {
                c_total += items[r].size_price;
              }
              if (c_total !== total) {
                res.json({ status: "error_total_size_price" });
              } else {
                for (q = 0; q < result.length; q++) {
                  trackings.push(result[q][0]);
                }
                var data2 = {
                  member_code: member_code,
                  user_id: user_id,
                  branch_id: branch_id,
                  carrier_id: carrier_id,
                  trackingList: trackings
                };
                request(
                  {
                    url: "https://www.945api.com/parcel/validate/tracking/api",
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

                            resItem.push(quicklinkService.checkTrackingBillingItem(billing_no,sender_name,sender_phone,sender_address,source,trackingItem,zipcodeItem,parcelTypeItem,sizePriceItem,codValueItem,sizeIdItem)
                            );
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
                                      billing_no: billing_no});
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
            }
          });
        }
      }
    );
  }
});

module.exports = app;
