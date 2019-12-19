const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {

    saveDataCapture: (ref, owner, phoneNumber, imageUrl, imagePath, code, rawData) => {
        // var dateNow = moment(date).format("YYYY-MM-DD HH:mm:ss");
        var sql="INSERT INTO parcel_capture_data(ref,owner,phone_number,barcode,image_url,image_path,record_created_at,raw_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        var data = [ref, owner, phoneNumber, code, imageUrl,imagePath, new Date(), rawData];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataCaptureBillingItem: (code) => {

        var sql="INSERT INTO billing_item(tracking) VALUES (?)"
        var data = [code];
        
        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataCaptureBillingReceiverInfo: (code) => {

        var sql="INSERT INTO billing_receiver_info(tracking) VALUES (?)"
        var data = [code];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
}