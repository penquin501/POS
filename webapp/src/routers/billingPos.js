const app = require("express").Router();
const billingPosService = require("../services/billingPosService.js");
const connection = require("../common/db.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
moment.locale('th')

app.get("/checkMember", jsonParser, (req, res) => {
  let memberCode = req.query.member_code;
  var regexPhone = /66\d{9}$/;
  // var strQuery = "SELECT parcel_member_info.*,bank_info.bank_name FROM parcel_member_info LEFT JOIN bank_info ON parcel_member_info.bank_id = bank_info.bank_id where ";
  var strQuery =
    "SELECT member_id as member_code, merid as branch_id,firstname as first_name, lastname as last_name,phoneregis as phone, bankacc as bank_account_no,bank_acc_name,bank_issue as bank_name FROM parcel_member WHERE ";
  if (memberCode.length == 13) {
    strQuery = strQuery + "citizenid ='" + memberCode + "'";
  } else if (memberCode.match(regexPhone)) {
    strQuery = strQuery + "phoneregis ='" + memberCode + "'";
  } else {
    strQuery = strQuery + "member_id ='" + memberCode + "'";
  }
  billingPosService.getMemberCode(strQuery).then(function (data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
});
app.get("/checkZipcode", (req, res) => {
  let zipcode = req.query.zipcode;
  billingPosService.getZipcode(zipcode).then(function (data) {
    if (data == false) {
      // res.status(404).send('Not Found')
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

  var dataJson = {
    user_id: user_id,
    branch_id: branch_id,
    mer_authen_level: mer_authen_level
  };

  request({
      url: "https://pos.945.report/genBillNo/genBillingNumber",
      method: "POST",
      body: dataJson,
      json: true
    },
    (err, res2, body) => {
      console.log(res2.body);
      billing_no = res2.body;

      var data = {
        billing_no: billing_no
      };
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

      request({
          // url: "https://apidev.whatitems.com/parcel/check/tracking/list/api",
          url: "https://www.945api.com/parcel/check/tracking/list/api",
          method: "POST",
          body: data2,
          json: true
        },
        (err, res3, body) => {
          if (res3.body.status != true) {
            // console.log("error",res2.body.status);
            res.json({
              status: res3.body.status
            });
          } else {

            billingPosService.saveDataBilling(user_id, mer_authen_level, member_code, carrier_id, billing_no, branch_id, total, img_url).then(function (data) {});
            for (i = 0; i < listTracking.length; i++) {
              let track = listTracking[i].tracking;
              let size_id = listTracking[i].size_id;
              let size_price = listTracking[i].size_price;
              let parcel_type = listTracking[i].parcel_type.toUpperCase();
              let cod_value = listTracking[i].cod_value;
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

              billingPosService.saveDataBillingItem(billing_no, track, zipcode, size_id, size_price, parcel_type, cod_value, source).then(function (data) {});
              billingPosService.saveDataBillingReceive(track, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark).then(function (data) {});
              billingPosService.updateDataBillingItemTemp(billing_no, track).then(function (data) {});
            }
            sendDataToMainServer(dataJson, data);
            res.json(data);
          }
        }
      );
    }
  );
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
  request({
      // url: "https://apidev.whatitems.com/parcel/check/tracking/list/api",
      url: "https://www.945api.com/parcel/check/tracking/list/api",
      method: "POST",
      body: data2,
      json: true
    },
    (err, res2, body) => {
      console.log("res2", res2.body.status);
      if (res2.body.status != true) {
        // console.log("error",res2.body.status);
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

          billingPosService.saveDataBillingItemTemp(billing_no_temp, tracking, zipcode, size_id, size_price, parcel_type, cod_value, source).then(function (data) {});
          billingPosService.saveDataBillingReceiveTemp(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark).then(function (data) {});
        }
        res.end("Complete.....");
      }
    }
  );

  //   res.end("Complete.....");
});

app.get("/deleteReceiverTemp", (req, res) => {
  let id = req.query.id;

  billingPosService.deleteItemTemp(id).then(function (data) {});
  billingPosService.deleteReceiverTemp(id).then(function (data) {});
  res.end("Delete Complete");
});

app.get("/getReceiver", (req, res) => {
  let billing_no = req.query.billing_no;
  billingPosService.getListReceiver(billing_no).then(function (data) {
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
  request({
      url: "https://www.945api.com/parcel/check/tracking/list/api",
      method: "POST",
      body: data2,
      json: true
    },
    (err, res2, body) => {
      if (res2.body.status != true) {
        res.send(false);
      } else {
        billingPosService.checkTracking(tracking).then(function (data) {
          billingPosService.checkTrackingTemp(tracking).then(function (data2) {
            if (data == true || data2 == true) {
              res.send(false);
            } else {
              res.send(true);
            }
          });
        });
      }
    })


});

app.get("/listBillngNo", (req, res) => {
  let branchId = req.query.branch_id;
  billingPosService.listBilling(branchId).then(function (data) {
    if (data == false) {
      res.send(false);
    } else {
      res.json(data);
    }
  });
});

app.get('/listDailyBilling', (req, res) => {
  let branch_id = req.query.branch_id
  billingPosService.listDailyMember(branch_id).then(function (data) {
    if (data == false) {
      res.json({
        status: 'Error No Data'
      });
    } else {
      res.json({
        status: 'success',
        data: data
      });
    }
  });

});

function sendDataToMainServer(dataAuthen, dataBill) {
  var orderlist = [];
  var paymentType = "";

  billingPosService.selectDataInBillNo(dataBill.billing_no).then(function (data) {
    for (i = 0; i < data.length; i++) {
      // "paymenttype": "99",99=normal,60=cod
      if (data[i].parcel_type.toUpperCase() == "NORMAL") {
        paymentType = "99";
      } else {
        paymentType = "60";
      }
      dataDes = {
        productinfo: {
          globalproductid: data[i].product_id,
          productname: data[i].product_name,
          methodtype: data[i].parcel_type.toUpperCase(),
          paymenttype: paymentType,
          price: data[i].size_price.toString(),
          codvalue: data[i].cod_value.toString()
        },
        destinationinfo: {
          custname: data[i].receiver_name,
          custphone: data[i].phone,
          custzipcode: data[i].zipcode,
          custaddr: data[i].receiver_address,
          //   "custdistrict": data[i].district_name,
          //   "custamphur": data[i].amphur_name,
          //   "custprovince": data[i].province_name,
          ordershortnote: data[i].remark,
          districtcode: data[i].DISTRICT_CODE,
          amphercode: data[i].AMPHUR_CODE,
          provincecode: data[i].PROVINCE_CODE,
          geoid: data[i].GEO_ID,
          geoname: data[i].GEO_NAME,
          sendername: data[i].sender_name,
          senderphone: data[i].sender_phone,
          senderaddr: data[i].sender_address
        },
        consignmentno: data[i].tracking
      };
      orderlist.push(dataDes);
    }

    var dataAll = {
      authen: {
        merid: dataAuthen.branch_id,
        userid: dataAuthen.user_id,
        merauthenlevel: dataAuthen.mer_authen_level
      },
      memberparcel: {
        memberinfo: {
          memberid: data[0].member_code,
          courierpid: data[0].carrier_id,
          courierimage: data[0].img_url
        },
        billingno: dataBill.billing_no,
        orderlist: orderlist
      }
    };
    // console.log("dataAll", JSON.stringify(dataAll));
    request({
        url: "https://www.945holding.com/webservice/restful/parcel/order_record/v11/data",
        method: "POST",
        body: dataAll,
        json: true,
        headers: {
          apikey: "XbOiHrrpH8aQXObcWj69XAom1b0ac5eda2b",
          "Content-Type": "application/json"
        }
      },
      (err, res, body) => {
        // console.log(res.body);
        if (
          res.body.checkpass == "pass" &&
          res.body.bill_no == "data_varidated_pass"
        ) {
          billingPosService.updateStatusBilling(dataBill.billing_no, res.body.checkpass).then(function (data) {});
          listStatus = res.body.status;
          for (i = 0; i < listStatus.length; i++) {
            var tracking = listStatus[i].consignmentno;
            var status = listStatus[i].status;
            billingPosService.updateStatusReceiverInfo(tracking, status).then(function (data) {});
          }
        }
      }
    );
  });
}
// setInterval(intervalFunc, 1500);

module.exports = app;