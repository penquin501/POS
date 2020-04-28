const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    saveQuicklinkBilling: (resBillingNo,user_id,mer_authen_level,member_code, carrier_id, billing_no, branch_id, total, img_url) => {
        var dateTimestamp = new Date();
        var dateTimestamp2 = +dateTimestamp
        var status='drafting'

        var sqlSaveBilling = "INSERT INTO billing(user_id, mer_authen_level, member_code, carrier_id, billing_date, billing_no, branch_id, total, timestamp, img_url,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)"
        var data=[user_id,mer_authen_level,member_code,carrier_id,new Date(),billing_no,branch_id,total,dateTimestamp2,img_url,status];

        var sqlTrackingInItem = "SELECT tracking FROM billing_item where billing_no=?";
        var dataBillingNo = [resBillingNo];

        var sqlCheckBilling ="SELECT billing_no FROM billing WHERE billing_no=?";
        var dataBilling = [resBillingNo];
        return new Promise(function(resolve, reject) {
            connection.query(sqlTrackingInItem,dataBillingNo, (error, results2, fields) => {
                if(results2.length>=0){
                  connection.query(sqlCheckBilling,dataBilling, (error, results, fields) => {
                    if(results.length<=0){
                      connection.query(sqlSaveBilling,data, (error, results3, fields) => {
                        resolve();
                      });
                    }
                  });
                }
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
    checkItem:(tracking,zipcode,size_id,size_price)=>{
        var checkSizeId="SELECT alias_size,parcel_price FROM size_info WHERE size_id=?"
        var dataSizeId=[size_id];

        var checkZipcode="SELECT zipcode,district_code FROM postinfo_zipcodes WHERE zipcode=?"
        var dataZipcode=[zipcode];

        var updateStatusBilling="SELECT tracking FROM billing_item WHERE tracking=? AND source is null"
        var dataStatusBilling=[tracking];
        
        return new Promise(function(resolve, reject) {
            connection.query(checkSizeId,dataSizeId, (error, resultsSize, fields) => {
                connection.query(checkZipcode,dataZipcode, (error, resultsZipcode, fields) => {
                    connection.query(updateStatusBilling,dataStatusBilling, (error, results, fields) => {
                        let c_district_code=true;
                        if(resultsSize[0].alias_size=='sd' && zipcode !== "10530"){
                            for(i=0;i<resultsZipcode.length;i++){
                                let district_code=resultsZipcode[i].district_code;
                                if(resultsSize[0].alias_size=='sd' && district_code[0]+district_code[1] !== '10'){
                                    c_district_code=false;
                                }
                            }
                            if(c_district_code){
                                if(results.length > 0 && resultsZipcode.length > 0 && resultsSize[0].parcel_price==size_price) {
                                    resolve(results);
                                } else {
                                    resolve();
                                }
                            } else {
                                resolve();
                            }
                        } else {
                            resolve();
                        }
                    });
                });
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
            connection.query(updateBillingItem,dataUpdateBillingItem, (error, results, fields) => {
                if(results.affectedRows>0){
                    resolve(billing_no);
                } else {
                    resolve();
                }
            });
            connection.query(updateReceiver,dataUpdateReceiver, (error, results, fields) => {});
            connection.query(updateBillNoBillingItem,dataUpdateBillingNoBillingItem, (error, results, fields) => {});
        })
    },
}