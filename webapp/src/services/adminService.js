const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    getTracking: () => {
        return new Promise(function(resolve, reject) {
            let sql = 'SELECT billItemTemp.tracking FROM billing_item_temp as billItemTemp JOIN billing_receiver_info_temp as billReceiveTemp ON billItemTemp.tracking=billReceiveTemp.tracking WHERE billItemTemp.source= "KEYIN" '
            connection.query(sql, (error, results, fields) => {

                resolve(results);
            });
        })
    },
    getTrackingKeyin: (tracking) => {
        return new Promise(function(resolve, reject) {
            let sql = 'SELECT billItemTemp.tracking as QLTracking,billItemTemp.parcel_type as QLParcelType, billReceiveTemp.receiver_name,billReceiveTemp.phone,billReceiveTemp.receiver_address,billReceiveTemp.zipcode, capture.image_url FROM billing_item_temp as billItemTemp JOIN billing_receiver_info_temp as billReceiveTemp ON billItemTemp.tracking=billReceiveTemp.tracking JOIN parcel_capture_data capture ON billItemTemp.tracking=capture.barcode WHERE billItemTemp.source="KEYIN" AND billItemTemp.tracking="' + tracking + '"'
            connection.query(sql, (error, results, fields) => {

                resolve(results);
            });
        })
    }
}