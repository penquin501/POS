const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    saveQuicklinkBilling: (user_id,mer_authen_level,member_code, carrier_id, billing_no, branch_id, total, img_url) => {
        return new Promise(function(resolve, reject) {
            var dateTimestamp = new Date();
            var dateTimestamp2 = +dateTimestamp
            var dateTimeString = moment(new Date).format("YYYY-MM-DD HH:mm:ss", true);
            let sql = "INSERT INTO billing(user_id, mer_authen_level, member_code, carrier_id, billing_date, billing_no, branch_id, total, timestamp, img_url) "+
            "VALUES ('"+user_id+"','"+mer_authen_level+"','"+member_code+"','"+carrier_id+"','"+dateTimeString+"','"+billing_no+"',"+branch_id+","+total+",'"+dateTimestamp2+"','"+img_url+"')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    saveTrackingTemp: (billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source) => {
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO billing_item_temp (billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source) VALUES ('" + billing_no + "','" + tracking + "','"+zipcode+"'," + size_id + "," + size_price + ",'" + parcel_type + "'," + cod_value + ",'" + source + "')"
            connection.query(sql, (err, results) => {

                resolve(results)
            })
        })
    },
    saveReceiverTemp: (tracking, parcelType,sender_name,sender_phone,sender_address,zipcode, source) => {
        return new Promise(function(resolve, reject) {
            let sql = "INSERT INTO billing_receiver_info_temp (tracking, parcel_type, sender_name, sender_phone, sender_address, zipcode,  remark) "+
            "VALUES ('" + tracking + "','"+parcelType+"','"+sender_name+"','"+sender_phone+"','"+sender_address+"','" + zipcode + "','" + source + "')"
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    updateTracking: (billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source) => {
        return new Promise(function(resolve, reject) {
            let sql = "UPDATE billing_item SET billing_no='" + billing_no + "',zipcode='"+zipcode+"',size_id=" + size_id + ",size_price=" + size_price + ",parcel_type='" + parcel_type + "',cod_value=" + cod_value + ",source='" + source + "' WHERE tracking='" + tracking + "'"
            connection.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },
    updateReceiver: (tracking, parcelType,sender_name,sender_phone,sender_address,zipcode, source) => {
        return new Promise(function(resolve, reject) {
            let sql = "UPDATE billing_receiver_info SET parcel_type='"+parcelType+"',sender_name='"+sender_name+"',sender_phone='"+sender_phone+"',sender_address='"+sender_address+"',zipcode='"+zipcode+"',remark='"+source+"' WHERE tracking='"+tracking+"'"
            connection.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },
    checkTrackingBillingItem: (billing_no,sender_name,sender_phone,sender_address,source,tracking,zipcode,parcel_type,size_price,cod_value,size_id) => {
        return new Promise(function(resolve, reject) {
            let sql = "SELECT bi.zipcode as bZipcode,bi.parcel_type as bType,br.parcel_type as rType,br.zipcode as rZipcode,bi.source FROM billing_item bi "+
            "JOIN billing_receiver_info br "+
            "ON bi.tracking=br.tracking "+
            "WHERE bi.tracking='"+tracking+"'"
            connection.query(sql, (error, results, fields) => {

                let saveBillingItemTemp = "INSERT INTO billing_item_temp (billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source) "+
                "VALUES ('" + billing_no + "','" + tracking + "','"+zipcode+"'," + size_id + "," + size_price + ",'" + parcel_type + "'," + cod_value + ",'" + source + "')"
                let saveReceiverTemp = "INSERT INTO billing_receiver_info_temp (tracking, parcel_type, sender_name, sender_phone, sender_address, zipcode,  remark) "+
                "VALUES ('" + tracking + "','"+parcel_type+"','"+sender_name+"','"+sender_phone+"','"+sender_address+"','" + zipcode + "','" + source + "')"
                let updateBillingItem = "UPDATE billing_item SET billing_no='" + billing_no + "',zipcode='"+zipcode+"',size_id=" + size_id + ",size_price=" + size_price + ",parcel_type='" + parcel_type + "',cod_value=" + cod_value + ",source='" + source + "' WHERE tracking='" + tracking + "'"
                let updateReceiver = "UPDATE billing_receiver_info SET parcel_type='"+parcel_type+"',sender_name='"+sender_name+"',sender_phone='"+sender_phone+"',sender_address='"+sender_address+"',zipcode='"+zipcode+"',remark='"+source+"' WHERE tracking='"+tracking+"'"
                let updateBillNoBillingItem="UPDATE billing_item SET billing_no='"+billing_no+"' WHERE tracking='"+tracking+"'"
                
                if((results[0].bZipcode == zipcode && results[0].rZipcode==zipcode && results[0].bType==parcel_type && results[0].rType == parcel_type) || 
                    (results[0].bZipcode==null && results[0].rZipcode==null && results[0].bType==null && results[0].rType==null && results[0].source==null)){
                    connection.query(updateBillingItem, (error, results, fields) => {});
                    connection.query(updateReceiver, (error, results, fields) => {});
                } else { 
                    connection.query(updateBillNoBillingItem, (error, results, fields) => {});
                    connection.query(saveBillingItemTemp, (error, results, fields) => {});
                    connection.query(saveReceiverTemp, (error, results, fields) => {});
                }
            })
        })
    },

    

}