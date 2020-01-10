const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    saveQuicklinkBilling: (user_id,mer_authen_level,member_code, carrier_id, billing_no, branch_id, total, img_url) => {
        var dateTimestamp = new Date();
        var dateTimestamp2 = +dateTimestamp
        var status='drafting'

        var sql = "INSERT INTO billing(user_id, mer_authen_level, member_code, carrier_id, billing_date, billing_no, branch_id, total, timestamp, img_url,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        var data=[user_id,mer_authen_level,member_code,carrier_id,new Date(),billing_no,branch_id,total,dateTimestamp2,img_url,status];

        return new Promise(function(resolve, reject) {
            
            connection.query(sql, data, (err, results) => {
                resolve(results)
            })
        })
    },
    updateStatusBilling:(billing_no)=>{
        var status='complete'
        var updateStatusBilling="UPDATE billing SET status=? WHERE billing_no=?"
        var dataStatusBilling=[status,billing_no];
        return new Promise(function(resolve, reject) {
            connection.query(updateStatusBilling,dataStatusBilling, (error, results, fields) => {
                resolve(results)
            });
        })
    },

    checkTrackingBillingItem: (billing_no,sender_name,sender_phone,sender_address,source,tracking,zipcode,parcel_type,size_price,cod_value,size_id) => {
        var updateBillingItem = "UPDATE billing_item SET billing_no=?,zipcode=?,size_id=?,size_price=?,parcel_type=?,cod_value=?,source=? WHERE tracking=?"
        var dataUpdateBillingItem=[billing_no,zipcode,size_id,size_price,parcel_type,cod_value,source,tracking];  

        var updateReceiver = "UPDATE billing_receiver_info SET sender_name=?,sender_phone=?,sender_address=? WHERE tracking=?"
        var dataUpdateReceiver=[sender_name,sender_phone,sender_address,tracking];    

        var updateBillNoBillingItem="UPDATE billing_item SET billing_no=? WHERE tracking=?"
        var dataUpdateBillingNoBillingItem=[billing_no,tracking];

        return new Promise(function(resolve, reject) {
            connection.query(updateBillingItem,dataUpdateBillingItem, (error, results, fields) => {});
            connection.query(updateReceiver,dataUpdateReceiver, (error, results, fields) => {});
            connection.query(updateBillNoBillingItem,dataUpdateBillingNoBillingItem, (error, results, fields) => {});
        })
    },
}