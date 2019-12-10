const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale('th')

module.exports = {
  saveKeyin: (uid,ref,barcode_orig,owner,phone_number,operator_id_re,rawData) => {
    return new Promise(function(resolve, reject) {
      let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
      var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
      let sql ="INSERT INTO parcel_keyin_data (uid,ref,barcode,owner,phone_number,operator_id,record_created_at,raw_data) "+
      "VALUES ('" +uid +"','" +ref +"','" +barcode_orig +"','" +owner +"','" +phone_number +"','" +operator_id_re +"','" +dateTimeString +"','" +rawData +"')";
      connection.query(sql, (err, results) => {
        resolve(results);
      });
    });
  },
  checkKeyinTrackingTemp: barcode_orig => {
    return new Promise(function(resolve, reject) {
      let sql ="SELECT barcode FROM parcel_keyin_data_temp WHERE barcode = '" +barcode_orig +"'";
      connection.query(sql, (error, results, fields) => {
        if (!results.length) {
          resolve(false);
        } else {
          resolve(results);
        }
      });
    });
  },
  saveKeyinTemp: (uid,ref,barcode_orig,owner,phone_number,operator_id_re,rawData) => {
    return new Promise(function(resolve, reject) {
      let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
      var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
      let sql ="INSERT INTO parcel_keyin_data_temp (uid,ref,barcode,owner,phone_number,operator_id,record_created_at,raw_data) "+
      "VALUES ('" +uid +"','" +ref +"','" +barcode_orig +"','" +owner +"','" +phone_number +"','" +operator_id_re +"','" +dateTimeString +"','" +rawData +"')";
      connection.query(sql, (err, results) => {
        resolve(results);
      });
    });
  },
  updateKeyinTemp: (uid,ref,barcode_orig,owner,phone_number,operator_id,rawData) => {
    return new Promise(function(resolve, reject) {
      let dateNow = new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"});
      var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss",true);
      let sql ="UPDATE parcel_keyin_data_temp SET uid='" +uid +"',ref='" +ref +"',barcode='" +barcode_orig + "',owner='" +owner +"',phone_number='" +phone_number +"',operator_id='" +operator_id +"',raw_data='" +rawData +"',record_created_at='" +dateTimeString +"' WHERE barcode ='" +barcode_orig +"'";
      connection.query(sql, (err, results) => {
        resolve(results);
      });
    });
  },

  getAmphurAndDistrictAndProvince: label_district_code => {
    return new Promise(function(resolve, reject) {
      let sql =
        "SELECT d.DISTRICT_NAME,a.AMPHUR_NAME,p.PROVINCE_NAME "+
        "FROM postinfo_zipcodes z "+
        "JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE "+
        "JOIN postinfo_amphur a ON d.AMPHUR_ID=a.AMPHUR_ID "+
        "JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID "+
        "WHERE z.district_code = '"+label_district_code+"'";
      connection.query(sql, (error, results, fields) => {
        resolve(results);
      });
    });
  },
  updateReceiver: (barcode_orig,label_parcel_type,label_name,label_phone_number,label_address,label_district_id,district_name,label_amphur_id,amphur_name,label_province_id,province_name,label_zipcode,source) => {
    return new Promise(function(resolve, reject) {
      let sql =
        "UPDATE billing_receiver_info SET parcel_type='" +label_parcel_type +"',receiver_name='" +label_name +"',phone='" +label_phone_number +"',receiver_address='" +label_address +"',district_id=" +label_district_id +",district_name='" +district_name +"',amphur_id=" +label_amphur_id +",amphur_name='" +amphur_name +"',province_id=" +label_province_id +",province_name='" +province_name +"',zipcode='" +label_zipcode +"',remark='" +source +"' WHERE tracking='" +barcode_orig +"'";
     
      connection.query(sql, (err, results) => {

        resolve(results);
      });
    });
  },
  updateBillingItem: (barcode_orig,label_zipcode,label_parcel_type,source) => {
    return new Promise(function(resolve, reject) {
      let sql ="UPDATE billing_item SET zipcode='" +label_zipcode +"',parcel_type='" +label_parcel_type +"',source='" +source +"' WHERE tracking='" +barcode_orig +"'";
      
      connection.query(sql, (err, results) => {
      
        resolve(results);
      });
    });
  },
  checkDataReceiver: barcode_orig => {
    return new Promise(function(resolve, reject) {
      let sql ="SELECT tracking,parcel_type,zipcode,remark FROM billing_receiver_info WHERE tracking = '" +barcode_orig +"' ";
      connection.query(sql, (error, results, fields) => {
        if (!results.length) {
          resolve(false);
        } else {
          resolve(results);
        }
      });
    });
  },

  saveBillingItemTemp: (barcode_orig, zipcode, label_parcel_type, source) => {
    var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss", true);
    return new Promise(function(resolve, reject) {
      let sql ="INSERT INTO billing_item_temp (tracking,zipcode,parcel_type,source) VALUES ('" +barcode_orig +"','" +zipcode +"','" +label_parcel_type +"','" +source +"')";
      connection.query(sql, (err, results) => {
        resolve(results);
      });
    });
  },
  saveBillingReceiverTemp: (barcode_orig,label_parcel_type,label_name,label_phone_number,label_address,label_district_id,district_name,label_amphur_id,amphur_name,label_province_id,province_name,label_zipcode,source) => {
    var dateTimeString = moment(new Date()).format("YYYY-MM-DD HH:mm:ss", true);
    return new Promise(function(resolve, reject) {
      let sql =
        "INSERT INTO billing_receiver_info_temp(tracking, parcel_type, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) " +
        "VALUES ('" +barcode_orig +"','" +label_parcel_type +"','" +label_name +"','" +label_phone_number +"','" +label_address +"'," +label_district_id + ",'" +district_name +"'," +label_amphur_id +",'" +amphur_name +"'," +label_province_id +",'" +province_name +"','" +label_zipcode +"','" +source +"')";
      connection.query(sql, (err, results) => {
        resolve(results);
      });
    });
  }
};
