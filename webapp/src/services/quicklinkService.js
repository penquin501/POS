const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    saveQuicklinkBilling: (user_id,mer_authen_level,member_code, carrier_id, billing_no, branch_id, total, img_url) => {
        var dateTimestamp = new Date();
        var dateTimestamp2 = +dateTimestamp
        // var dateTimeString = moment(new Date).format("YYYY-MM-DD HH:mm:ss", true);

        var sql = "INSERT INTO billing(user_id, mer_authen_level, member_code, carrier_id, billing_date, billing_no, branch_id, total, timestamp, img_url) VALUES (?,?,?,?,?,?,?,?,?,?)"
        var data=[user_id,mer_authen_level,member_code,carrier_id,new Date(),billing_no,branch_id,total,dateTimestamp2,img_url];

        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results)
            })
        })
    },
    saveTrackingTemp: (billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source) => {
        var sql = "INSERT INTO billing_item_temp (billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source) VALUES (?,?,?,?,?,?,?,?)"
        var data=[billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source];  

        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results)
            })
        })
    },
    saveReceiverTemp: (tracking, parcelType,sender_name,sender_phone,sender_address,zipcode, source) => {
        var sql = "INSERT INTO billing_receiver_info_temp (tracking, parcel_type, sender_name, sender_phone, sender_address, zipcode, remark) VALUES (?,?,?,?,?,?,?)"
        var data=[tracking,parcelType,sender_name,sender_phone,sender_address,zipcode,source];

        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results)
            })
        })
    },
    updateTracking: (billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source) => {
        var sql = "UPDATE billing_item SET billing_no=?,zipcode=?,size_id=?,size_price=?,parcel_type=?,cod_value=?,source=? WHERE tracking=?"
        var data=[billing_no,zipcode,size_id,size_price,parcel_type,cod_value,source,tracking];    

        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results);
            });
        })
    },
    updateReceiver: (tracking, parcelType,sender_name,sender_phone,sender_address,zipcode, source) => {
        var sql = "UPDATE billing_receiver_info SET parcel_type=?,sender_name=?,sender_phone=?,sender_address=?,zipcode=?,remark=? WHERE tracking=?"
        var data=[parcelType,sender_name,sender_phone,sender_address,zipcode,source,tracking];    
        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results);
            });
        })
    },
    checkTrackingBillingItem: (billing_no,sender_name,sender_phone,sender_address,source,tracking,zipcode,parcel_type,size_price,cod_value,size_id) => {
        // var sql = "SELECT bi.zipcode as bZipcode,bi.parcel_type as bType,br.parcel_type as rType,br.zipcode as rZipcode,bi.source FROM billing_item bi "+
        //     "JOIN billing_receiver_info br ON bi.tracking=br.tracking WHERE bi.tracking=?" 
        // var data=[tracking]; 

        // var saveBillingItemTemp = "INSERT INTO billing_item_temp (billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source) VALUES (?,?,?,?,?,?,?,?)"
        // var dataBillingTemp=[billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source];

        // var saveReceiverTemp = "INSERT INTO billing_receiver_info_temp (tracking, parcel_type, sender_name, sender_phone, sender_address, zipcode,  remark) VALUES (?,?,?,?,?,?,?)"
        // var dataReceiverTemp=[tracking,parcel_type,sender_name,sender_phone,sender_address,zipcode,source];        
        
        var updateBillingItem = "UPDATE billing_item SET billing_no=?,zipcode=?,size_id=?,size_price=?,parcel_type=?,cod_value=?,source=? WHERE tracking=?"
        var dataUpdateBillingItem=[billing_no,zipcode,size_id,size_price,parcel_type,cod_value,source,tracking];  

        var updateReceiver = "UPDATE billing_receiver_info SET sender_name=?,sender_phone=?,sender_address=? WHERE tracking=?"
        var dataUpdateReceiver=[sender_name,sender_phone,sender_address,tracking];    

        var updateBillNoBillingItem="UPDATE billing_item SET billing_no=? WHERE tracking=?"
        var dataUpdateBillingNoBillingItem=[billing_no,tracking];

        return new Promise(function(resolve, reject) {
            
            // connection.query(sql, data, (err, results) => {
                
                // if((results[0].bZipcode == zipcode && results[0].rZipcode==zipcode && results[0].bType==parcel_type && results[0].rType == parcel_type) || 
                    // (results[0].bZipcode==null && results[0].rZipcode==null && results[0].bType==null && results[0].rType==null && results[0].source==null)){
                    connection.query(updateBillingItem,dataUpdateBillingItem, (error, results, fields) => {});
                    connection.query(updateReceiver,dataUpdateReceiver, (error, results, fields) => {});
                // } else { 
                    connection.query(updateBillNoBillingItem,dataUpdateBillingNoBillingItem, (error, results, fields) => {});

                    // connection.query(saveBillingItemTemp, dataBillingTemp, (err, results) => {});
                    // connection.query(saveReceiverTemp, dataReceiverTemp, (err, results) => {});
                // }
            // })
        })
    },

    

}