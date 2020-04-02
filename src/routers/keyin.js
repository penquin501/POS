const app = require("express").Router();
const keyinService = require("../services/keyinService.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
moment.locale('th')

app.post("/keyin", jsonParser, (req, res) => {
  
  let data = req.body;
  console.log('key In for barcode : %s',data[0].barcode);
  let rawData = JSON.stringify(data);
  let uid = data[0].uid;
  let ref = data[0].ref;
  let barcode = data[0].barcode;
  // let barcode_orig = data[0].barcode_orig;
  let owner = data[0].owner;
  let phone_number = data[0].phone_number;
  let operator_id = data[0].operator_id;
  var operator_id_re = operator_id.replace("+", "");
  let label_parcel_type = data[0].label_parcel_type;
  let label_address = data[0].label_address;
  let label_name = data[0].label_name;
  let label_phone_number = data[0].label_phone_number;
  let label_amphur_id = data[0].label_amphur_id;
  let label_amphur_code = data[0].label_amphur_code;
  let label_district_id = data[0].label_district_id;
  let label_district_code = data[0].label_district_code;
  let label_province_id = data[0].label_province_id;
  let label_province_code = data[0].label_province_code;
  let label_zipcode = data[0].label_zipcode;
  var source = "KEYIN";

  keyinService.saveKeyin(uid,ref,barcode,owner,phone_number,operator_id_re,rawData).then(function(data) {});

  keyinService.checkKeyinTrackingTemp(barcode).then(function(data) {
    if (data == false) {
      keyinService.saveKeyinTemp(uid,ref,barcode,owner,phone_number,operator_id_re,rawData).then(function(data) {});
    } else {
      keyinService.updateKeyinTemp(uid,ref,barcode,owner,phone_number,operator_id,rawData).then(function(data) {});
    }
  });

  keyinService.getAmphurAndDistrictAndProvince(label_district_code).then(function(data) {
      var district_name = data[0].DISTRICT_NAME;
      var amphur_name = data[0].AMPHUR_NAME;
      var province_name = data[0].PROVINCE_NAME;
      keyinService.checkDataReceiver(barcode).then(function(dataReceiver) {
        
        if (dataReceiver == false) {
          keyinService.saveBillingReceiverTemp(barcode,label_parcel_type,label_name,label_phone_number,label_address,label_district_id,district_name,label_amphur_id,amphur_name,label_province_id,province_name,label_zipcode,source).then(function(data) {});
        } else {
          keyinService.updateReceiver(barcode,label_parcel_type,label_name,label_phone_number,label_address,label_district_id,district_name,label_amphur_id,amphur_name,label_province_id,province_name,label_zipcode,source).then(function(data) {});
        }
      });
    });

  res.json({status:'Complete'});
});
module.exports = app;
