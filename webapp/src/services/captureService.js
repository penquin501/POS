const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale("th");

module.exports = {
 
  checkDataCapture: (ref, owner, phoneNumber, imageUrl, imagePath, code, rawData) => {
    var sql="SELECT barcode FROM parcel_capture_data WHERE barcode=?"

    var sqlCapture="INSERT INTO parcel_capture_data(ref,owner,phone_number,barcode,image_url,image_path,record_created_at,raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    var dataCapture = [ref, owner, phoneNumber, code, imageUrl,imagePath, new Date(), rawData];

    var sqlBillingItem="INSERT INTO billing_item(tracking) VALUES (?)"

    var sqlReceiver="INSERT INTO billing_receiver_info(tracking) VALUES (?)"
    var data = [code];

    return new Promise(function(resolve, reject) {
        connection.query(sql, data, (err, results) => {
            console.log("capture",code);
            if(err===null){
                if(results.length<=0){
                    
                    connection.query(sqlCapture, dataCapture, (err, results) => {});
                    connection.query(sqlBillingItem, data, (err, results) => {});
                    connection.query(sqlReceiver, data, (err, results) => {});
                }
            }
            
        });
    })
},
  saveDataCapture: (ref,owner,phoneNumber,imageUrl,imagePath,code,rawData) => {
    var sql ="INSERT INTO parcel_capture_data(ref,owner,phone_number,barcode,image_url,image_path,record_created_at,raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    var data = [ref,owner,phoneNumber,code,imageUrl,imagePath,new Date(),rawData];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveDataCaptureBillingItem: code => {
    var sql = "INSERT INTO billing_item(tracking) VALUES (?)";
    var data = [code];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveDataCaptureBillingReceiverInfo: code => {
    var sql = "INSERT INTO billing_receiver_info(tracking) VALUES (?)";
    var data = [code];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  }
};
