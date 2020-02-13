const app = require("express").Router();
const billingPosService = require("../services/billingPosService.js");
const quicklinkService = require("../services/quicklinkService.js");
const connection = require("../common/db.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
moment.locale("th");

app.get("/checkZipcode", (req, res) => {
  let zipcode = req.query.zipcode;
  if(zipcode==""){
    res.json({status:"ERROR_NOT_COMPLETE"});
  } else {
  billingPosService.getZipcode(zipcode).then(function(data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
}
});
app.get("/checktest", (req, res) => {
  var billing_no = req.query.billing_no;
  billingPosService.checkBillingNoItem(billing_no).then(function(data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
});

app.post("/addReceiver", jsonParser, (req, res) => {
  var billing_no;
  let user_id = req.body.user_id;
  let branch_id = req.body.branch_id;
  let mer_authen_level = req.body.mer_authen_level;
  let member_code = req.body.member_code;
  let carrier_id = req.body.carrier_id;
  let img_url = req.body.courier_image;
  let total = req.body.total;
  let listTracking = req.body.listTracking;
  var source = "POS";
  let trackings = [];

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
    img_url === null ||
    img_url === undefined ||
    img_url === "" ||
    img_url.match(regex_img) === null
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (
    total === null ||
    total === undefined ||
    parseInt(total) === 0 ||
    total === ""
  ) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (listTracking.length === 0) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else {
    var dataJson = {
      user_id: user_id,
      branch_id: branch_id,
      mer_authen_level: mer_authen_level
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
        for (i = 0; i < listTracking.length; i++) {
          // tracking = listTracking[i].tracking;
          address = listTracking[i].address;
          if (listTracking[i].tracking === null) {
            var item_valid = false;
          }
          if (listTracking[i].tracking === undefined) {
            var item_valid = false;
          }
          if (listTracking[i].tracking === "") {
            var item_valid = false;
          }
          if (listTracking[i].size_id === null) {
            var item_valid = false;
          }
          if (listTracking[i].size_id === undefined) {
            var item_valid = false;
          }
          if (listTracking[i].size_id === "") {
            var item_valid = false;
          }
          if (listTracking[i].size_price === null) {
            var item_valid = false;
          }
          if (listTracking[i].size_price === undefined) {
            var item_valid = false;
          }
          if (listTracking[i].size_price === "") {
            var item_valid = false;
          }
          if (listTracking[i].parcel_type === null) {
            var item_valid = false;
          }
          if (listTracking[i].parcel_type === undefined) {
            var item_valid = false;
          }
          if (listTracking[i].parcel_type === "") {
            var item_valid = false;
          }
          if (listTracking[i].cod_value === null) {
            var item_valid = false;
          }
          if (listTracking[i].cod_value === undefined) {
            var item_valid = false;
          }
          if (listTracking[i].cod_value === "") {
            var item_valid = false;
          }
          if (
            listTracking[i].parcel_type.toUpperCase() == "NORMAL" &&
            parseInt(listTracking[i].cod_value) !== 0
          ) {
            item_valid = false;
          }
          if (
            listTracking[i].parcel_type.toUpperCase() == "COD" &&
            (parseInt(listTracking[i].cod_value) <= 0 ||
              parseInt(listTracking[i].cod_value) > 30000)
          ) {
            item_valid = false;
          }
          if (address.sender_name === null) {
            var item_valid = false;
          }
          if (address.sender_name === undefined) {
            var item_valid = false;
          }
          if (address.sender_name === "") {
            var item_valid = false;
          }
          if (address.sender_phone === null) {
            var item_valid = false;
          }
          if (address.sender_phone === undefined) {
            var item_valid = false;
          }
          if (address.sender_phone === "") {
            var item_valid = false;
          }
          if (address.sender_phone.match(regexPhone) === null) {
            var item_valid = false;
          }
          if (address.sender_address === null) {
            var item_valid = false;
          }
          if (address.sender_address === undefined) {
            var item_valid = false;
          }
          if (address.sender_address === "") {
            var item_valid = false;
          }
          if (address.receiver_name === null) {
            var item_valid = false;
          }
          if (address.receiver_name === undefined) {
            var item_valid = false;
          }
          if (address.receiver_name === "") {
            var item_valid = false;
          }
          if (address.phone === null) {
            var item_valid = false;
          }
          if (address.phone === undefined) {
            var item_valid = false;
          }
          if (address.phone === "") {
            var item_valid = false;
          }
          if (address.phone.match(regexPhone) === null) {
            var item_valid = false;
          }
          if (address.receiver_address === null) {
            var item_valid = false;
          }
          if (address.receiver_address === undefined) {
            var item_valid = false;
          }
          if (address.receiver_address === "") {
            var item_valid = false;
          }
          if (address.district_id === null) {
            var item_valid = false;
          }
          if (address.district_id === undefined) {
            var item_valid = false;
          }
          if (address.district_id === "") {
            var item_valid = false;
          }
          if (address.district_name === null) {
            var item_valid = false;
          }
          if (address.district_name === undefined) {
            var item_valid = false;
          }
          if (address.district_name === "") {
            var item_valid = false;
          }
          if (address.amphur_id === null) {
            var item_valid = false;
          }
          if (address.amphur_id === undefined) {
            var item_valid = false;
          }
          if (address.amphur_id === "") {
            var item_valid = false;
          }
          if (address.amphur_name === null) {
            var item_valid = false;
          }
          if (address.amphur_name === undefined) {
            var item_valid = false;
          }
          if (address.amphur_name === "") {
            var item_valid = false;
          }
          if (address.province_id === null) {
            var item_valid = false;
          }
          if (address.province_id === undefined) {
            var item_valid = false;
          }
          if (address.province_id === "") {
            var item_valid = false;
          }
          if (address.province_name === null) {
            var item_valid = false;
          }
          if (address.province_name === undefined) {
            var item_valid = false;
          }
          if (address.province_name === "") {
            var item_valid = false;
          }
          if (address.zipcode === null) {
            var item_valid = false;
          }
          if (address.zipcode === undefined) {
            var item_valid = false;
          }
          if (address.zipcode === "") {
            var item_valid = false;
          }
          if (address.remark === null) {
            var item_valid = false;
          }
          if (address.remark === undefined) {
            var item_valid = false;
          }
        }

        if (item_valid == false) {
          res.json({ status: "error_validate_tracking" });
        } else {
          var responseCheckItem = [];
          async function checkItem() {
            await listTracking.forEach(async val => {
              let c_address = val.address;
              responseCheckItem.push(
                billingPosService.checkItem(
                  val.tracking,
                  val.size_id,
                  val.size_price,
                  c_address.district_id,
                  c_address.amphur_id,
                  c_address.province_id,
                  c_address.zipcode
                )
              );
            });
            return await Promise.all(responseCheckItem);
          }
          checkItem().then(function(result) {
            console.log(result);
            var item_pass = true;
            for (j = 0; j < result.length; j++) {
              if (result[j] == undefined) {
                item_pass = false;
              }
            }

            if (item_pass == false) {
              /* error tracking ซ้ำ/ข้อมูล zipcode ผิด/size id กับราคาผิด  */
              res.json({ status: "error_tracking" });
            } else {
              let c_total = 0;
              for (r = 0; r < listTracking.length; r++) {
                c_total += listTracking[r].size_price;
              }
              if (c_total !== total) {
                res.json({ status: "error_total_size_price" });
              } else {
                for (q = 0; q < result.length; q++) {
                  let tracking = {
                    tracking: result[q]
                  };
                  trackings.push(tracking);
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
                        res.json({
                          status: res3.body.status
                        });
                      } else {
                        console.log("begin", billing_no);
                        async function saveItem() {
                          var resItem = [];
                          await listTracking.forEach(async val => {
                            let track = val.tracking;
                            let size_id = val.size_id;
                            let size_price = val.size_price;
                            let parcel_type = val.parcel_type.toUpperCase();
                            let cod_value = val.cod_value;
                            let address = val.address;

                            resItem.push(billingPosService.saveDataBillingItem(billing_no,track,size_id,size_price,parcel_type,cod_value,source,address));
                          });

                          var resultArr = await Promise.all(resItem);
                          return resultArr[0];
                        }
                        saveItem().then(function(result) {
                          async function dataProcess(t) {
                            if (typeof t == "undefined") {
                              return false;
                            } else {
                              let resultBilling = await billingPosService.saveDataBilling(
                                t,
                                user_id,
                                mer_authen_level,
                                member_code,
                                carrier_id,
                                billing_no,
                                branch_id,
                                total,
                                img_url
                              );
                              return resultBilling;
                            }
                          }
                          dataProcess(result).then(data => {
                            if (data === false) {
                              res.json({
                                status: "error"
                              });
                            } else {
                              quicklinkService
                                .updateStatusBilling(billing_no)
                                .then(function(resBilling) {
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
            }
          });
        }
      }
    );
  }
});

app.post("/addReceiverTemp", jsonParser, (req, res) => {
  let billing_no_temp = "temp001";
  let listTracking = req.body.listTracking;
  let trackings = [];
  for (i = 0; i < listTracking.length; i++) {
    let tracking = listTracking[i].tracking;
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
      // url: "https://apidev.whatitems.com/parcel/check/tracking/list/api",
      url: "https://www.945api.com/parcel/check/tracking/list/api",
      method: "POST",
      body: data2,
      json: true
    },
    (err, res2, body) => {
      if (err === null) {
        if (res2.body.status != true) {
          res.json({
            status: res2.body.status
          });
        } else {
          for (i = 0; i < listTracking.length; i++) {
            let tracking = listTracking[i].tracking;
            let size_id = listTracking[i].size_id;
            let size_price = listTracking[i].size_price;
            let parcel_type = listTracking[i].parcel_type.toUpperCase();
            let cod_value = listTracking[i].cod_value;
            let source = "POS";

            let address = listTracking[i].address;
            let sender_name = address.sender_name;
            let sender_phone = address.sender_phone;
            let sender_address = address.sender_address;
            let receiver_name = address.receiver_name;
            let phone = address.phone;
            let receiver_address = address.receiver_address;
            let district_id = address.district_id;
            let district_name = address.district_name;
            let amphur_id = address.amphur_id;
            let amphur_name = address.amphur_name;
            let province_id = address.province_id;
            let province_name = address.province_name;
            let zipcode = address.zipcode;
            let remark = address.remark;

            billingPosService
              .saveDataBillingItemTemp(
                billing_no_temp,
                tracking,
                zipcode,
                size_id,
                size_price,
                parcel_type,
                cod_value,
                source
              )
              .then(function(data) {});
            billingPosService
              .saveDataBillingReceiverTemp(
                tracking,
                parcel_type,
                sender_name,
                sender_phone,
                sender_address,
                receiver_name,
                phone,
                receiver_address,
                district_id,
                district_name,
                amphur_id,
                amphur_name,
                province_id,
                province_name,
                zipcode,
                remark
              )
              .then(function(data) {});
          }
          res.end("Complete.....");
        }
      }
    }
  );
});

app.get("/deleteReceiverTemp", (req, res) => {
  let id = req.query.id;

  billingPosService.deleteItemTemp(id).then(function(data) {});
  billingPosService.deleteReceiverTemp(id).then(function(data) {});
  res.end("Delete Complete");
});

app.get("/getReceiver", (req, res) => {
  let billing_no = req.query.billing_no;
  billingPosService.getListReceiver(billing_no).then(function(data) {
    res.json(data);
  });
});

app.get("/checkTracking", (req, res) => {
  let tracking = req.query.tracking;

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
      url: "https://www.945api.com/parcel/check/tracking/list/api",
      method: "POST",
      body: data2,
      json: true
    },
    (err, res2, body) => {
      if (err === null) {
        if (res2.body.status != true) {
          res.send(false);
        } else {
          billingPosService.checkTracking(tracking).then(function(data) {
            billingPosService.checkTrackingTemp(tracking).then(function(data2) {
              if (data == true || data2 == true) {
                res.send(false);
              } else {
                res.send(true);
              }
            });
          });
        }
      }
    }
  );
});

app.get("/listBillngNo", (req, res) => {
  let branchId = req.query.branch_id;
  billingPosService.listBilling(branchId).then(function(data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
});

app.get("/listDailyBilling", (req, res) => {
  let branch_id = req.query.branch_id;
  billingPosService.listDailyMember(branch_id).then(function(data) {
    if (data == false) {
      res.json({
        status: "Error No Data"
      });
    } else {
      res.json({
        status: "success",
        data: data
      });
    }
  });
});

app.get("/test", jsonParser, (req, res) => {
  // billingPosService.testData().then(function(result) {});

  res.end();
});

module.exports = app;
