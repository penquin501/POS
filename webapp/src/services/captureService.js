const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale("th");

module.exports = {
  checkItem: code => {
    var sqlTrackingInItem ="SELECT tracking FROM billing_item_test where tracking=?";
    var sqlTrackingReceiver ="SELECT tracking FROM billing_receiver_info_test where tracking=?";

    var sqlBillingItem = "INSERT INTO billing_item_test(tracking) VALUES (?)";
    var sqlReceiver ="INSERT INTO billing_receiver_info_test(tracking) VALUES (?)";

    var data = [code];

    return new Promise(function(resolve, reject) {
      connection.query(sqlTrackingInItem,data, (error, resultsItem, fields) => {
          if (resultsItem.length <= 0) {
            connection.query(sqlBillingItem, data, (error, results, fields) => {
              resolve(code);
            });
          }
        }
      );
      connection.query(sqlTrackingReceiver,data,(error, resultsReceiver, fields) => {
          if (resultsReceiver.length <= 0) {
            connection.query(sqlReceiver, data, (error, results, fields) => {});
          }
        }
      );
    });
  },
  checkCaptureData: (ref,owner,phoneNumber,imageUrl,imagePath,code,rawData) => {
    var sql = "SELECT barcode FROM parcel_capture_data_test WHERE barcode=?";
    var data = [code];

    var sqlCapture =
      "INSERT INTO parcel_capture_data_test(ref,owner,phone_number,barcode,image_url,image_path,record_created_at,raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    var dataCapture = [ref,owner,phoneNumber,code,imageUrl,imagePath,new Date(),rawData];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (results.length <= 0) {
          connection.query(sqlCapture, dataCapture, (err, resultsCapture) => {
            resolve(code);
          });
        } else {
          resolve();
        }
      });
    });
  },
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
