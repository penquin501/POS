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
  billingPosService.getZipcode(zipcode).then(function(data) {
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

  if (user_id === null || user_id === null) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (branch_id === null || branch_id === null) {
    res.json({ status: "ERROR_DATA_NOT_COMPLETE" });
  } else if (mer_authen_level === null || mer_authen_level === null) {
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

        for (i = 0; i < listTracking.length; i++) {
          tracking = listTracking[i].tracking;
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
          (err, res3, body) => {
            if (res3.body.status != true) {
              res.json({
                status: res3.body.status
              });
            } else {
              billingPosService.saveDataBilling(user_id,mer_authen_level,member_code,carrier_id,billing_no,branch_id,total,img_url)
              
                let saveItem = async () => {
                  await listTracking.forEach(async val => {
                    let track = val.tracking;
                    let size_id = val.size_id;
                    let size_price = val.size_price;
                    let parcel_type = val.parcel_type.toUpperCase();
                    let cod_value = val.cod_value;
                    let address = val.address;

                    await billingPosService.saveDataBillingItem(billing_no,track,size_id,size_price,parcel_type,cod_value,source,address)
                  })
                  return true;
                };
                saveItem().then(result => {
                  if (result) {
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
            }
          }
        );
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

          billingPosService.saveDataBillingItemTemp(billing_no_temp,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source).then(function(data) {});
          billingPosService.saveDataBillingReceiverTemp(tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark).then(function(data) {});
        }
        res.end("Complete.....");
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
