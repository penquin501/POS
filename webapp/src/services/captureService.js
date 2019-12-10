const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {

    saveDataCapture: (ref, owner, phoneNumber, imageUrl, imagePath, code, rawData) => {
        var date = new Date()
        var dateNow = moment(date).format("YYYY-MM-DD HH:mm:ss");
        var dateTimestamp = (+date)
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO parcel_capture_data (ref,owner,phone_number,barcode,image_url,image_path,record_created_at,raw_data) VALUES ('" + ref + "','" + owner + "','" + phoneNumber + "','" + code + "','" + imageUrl + "','" + imagePath + "','" + dateNow + "','" + rawData + "')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    saveDataCaptureBilling: (billing_no, dateNow, dateTimestamp) => {
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO `billing`(`billing_no`,`billing_date`,`timestamp`) VALUES ('" + billing_no + "','" + dateNow + "','" + dateTimestamp + "')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    saveDataCaptureBillingItem: (code) => {
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO billing_item (tracking) VALUES ('" + code + "')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    saveDataCaptureBillingReceiverInfo: (code) => {
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO `billing_receiver_info`(`tracking`) VALUES ('" + code + "')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
}