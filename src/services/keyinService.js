const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale("th");

module.exports = {
  saveKeyin: (
    uid,
    ref,
    barcode_orig,
    owner,
    phone_number,
    operator_id_re,
    rawData
  ) => {
    // var dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    // var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
    var sql =
      "INSERT INTO parcel_keyin_data (uid,ref,barcode,owner,phone_number,operator_id,record_created_at,raw_data) VALUES (?,?,?,?,?,?,?,?)";
    var data = [
      uid,
      ref,
      barcode_orig,
      owner,
      phone_number,
      operator_id_re,
      new Date(),
      rawData
    ];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  checkKeyinTrackingTemp: barcode_orig => {
    var sql = "SELECT barcode FROM parcel_keyin_data_temp WHERE barcode = ?";
    var data = [barcode_orig];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(results);
          }
        } else {
          console.log(err);
        }
      });
    });
  },
  saveKeyinTemp: (
    uid,
    ref,
    barcode_orig,
    owner,
    phone_number,
    operator_id_re,
    rawData
  ) => {
    // let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    // var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
    var sql =
      "INSERT INTO parcel_keyin_data_temp (uid,ref,barcode,owner,phone_number,operator_id,record_created_at,raw_data) VALUES (?,?,?,?,?,?,?,?)";
    var data = [
      uid,
      ref,
      barcode_orig,
      owner,
      phone_number,
      operator_id_re,
      new Date(),
      rawData
    ];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateKeyinTemp: (
    uid,
    ref,
    barcode_orig,
    owner,
    phone_number,
    operator_id,
    rawData
  ) => {
    // let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
    // var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
    var sql =
      "UPDATE parcel_keyin_data_temp SET uid=?,ref=?,barcode=?,owner=?,phone_number=?,operator_id=?,raw_data=?,record_created_at=? WHERE barcode =?";
    var data = [
      uid,
      ref,
      barcode_orig,
      owner,
      phone_number,
      operator_id,
      rawData,
      new Date(),
      barcode_orig
    ];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },

  getAmphurAndDistrictAndProvince: label_district_code => {
    var sql =
      "SELECT d.DISTRICT_NAME,a.AMPHUR_NAME,p.PROVINCE_NAME " +
      "FROM postinfo_zipcodes z " +
      "JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE " +
      "JOIN postinfo_amphur a ON d.AMPHUR_ID=a.AMPHUR_ID " +
      "JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID " +
      "WHERE z.district_code = ?";
    var data = [label_district_code];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateReceiver: (
    barcode_orig,
    label_parcel_type,
    label_name,
    label_phone_number,
    label_address,
    label_district_id,
    district_name,
    label_amphur_id,
    amphur_name,
    label_province_id,
    province_name,
    label_zipcode,
    source
  ) => {
    let sql =
      "UPDATE billing_receiver_info SET parcel_type=?,receiver_name=?,phone=?,receiver_address=?,district_id=?,district_name=?,amphur_id=?,amphur_name=?,province_id=?,province_name=?,zipcode=?,remark=? WHERE tracking=?";
    var data = [
      label_parcel_type,
      label_name,
      label_phone_number,
      label_address,
      label_district_id,
      district_name,
      label_amphur_id,
      amphur_name,
      label_province_id,
      province_name,
      label_zipcode,
      source,
      barcode_orig
    ];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateBillingItem: (
    barcode_orig,
    label_zipcode,
    label_parcel_type,
    source
  ) => {
    let sql =
      "UPDATE billing_item SET zipcode=?,parcel_type=?,source=? WHERE tracking=?";
    var data = [label_zipcode, label_parcel_type, source, barcode_orig];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  checkDataReceiver: barcode_orig => {
    let sql =
      "SELECT tracking,parcel_type,zipcode,remark FROM billing_receiver_info WHERE tracking = ?";
    var data = [barcode_orig];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(results);
          }
        }
      });
    });
  },

  saveBillingItemTemp: (barcode_orig, zipcode, label_parcel_type, source) => {
    var sql =
      "INSERT INTO billing_item_temp (tracking,zipcode,parcel_type,source) VALUES (?,?,?,?)";
    var data = [barcode_orig, zipcode, label_parcel_type, source];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveBillingReceiverTemp: (
    barcode_orig,
    label_parcel_type,
    label_name,
    label_phone_number,
    label_address,
    label_district_id,
    district_name,
    label_amphur_id,
    amphur_name,
    label_province_id,
    province_name,
    label_zipcode,
    source
  ) => {
    var sql =
      "INSERT INTO billing_receiver_info_temp(tracking, parcel_type, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var data = [
      barcode_orig,
      label_parcel_type,
      label_name,
      label_phone_number,
      label_address,
      label_district_id,
      district_name,
      label_amphur_id,
      amphur_name,
      label_province_id,
      province_name,
      label_zipcode,
      source
    ];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  }
};
