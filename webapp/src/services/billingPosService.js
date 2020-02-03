const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale("th");

module.exports = {
  getZipcode: zipcode => {
    var sql =
      "SELECT z.district_code as DISTRICT_CODE,z.zipcode,d.DISTRICT_ID,d.DISTRICT_NAME,a.AMPHUR_ID,a.AMPHUR_NAME,p.PROVINCE_ID,p.PROVINCE_NAME " +
      "FROM postinfo_zipcodes z " +
      "JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE " +
      "JOIN postinfo_amphur a ON d.AMPHUR_ID=a.AMPHUR_ID " +
      "JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID " +
      "WHERE z.zipcode LIKE ?";

    var data = [zipcode + "%"];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(results);
          }
        }
      });
    });
  },
  deleteItemTemp: id => {
    var sql = "DELETE FROM billing_item_temp WHERE tracking = ?";
    var data = [id];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  deleteReceiverTemp: id => {
    var sql = "DELETE FROM billing_receiver_info_temp WHERE tracking = ?";
    var data = [id];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  getListReceiver: billing_no => {
    var sql =
      "SELECT DISTINCT billing_item.tracking,billing_item.parcel_type,billing_item.size_price,billing_receiver_info.receiver_name,billing_receiver_info.district_name,billing_receiver_info.amphur_name,billing_receiver_info.province_name,billing_receiver_info.zipcode,billing.total,billing_receiver_info.status FROM billing LEFT JOIN billing_item ON billing.billing_no = billing_item.billing_no LEFT JOIN billing_receiver_info ON billing_item.tracking = billing_receiver_info.tracking WHERE billing.billing_no = ?";
    var data = [billing_no];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveDataBilling: (resBillingNo,user_id,mer_authen_level,member_code,carrier_id,billing_no,branch_id,total,img_url) => {

    var dateTimestamp = new Date();
    var dateTimestamp2 = +dateTimestamp;
    var status='drafting'

    var sqlSaveBilling ="INSERT INTO billing_test(user_id,mer_authen_level,member_code,carrier_id,billing_date,billing_no,branch_id,total,timestamp,img_url) VALUES (?,?,?,?,?,?,?,?,?,?)";
    var dataSaveBilling = [user_id,mer_authen_level,member_code,carrier_id,new Date(),billing_no,branch_id,total,dateTimestamp2,img_url,status];

    var sqlCheckBilling ="SELECT billing_no FROM billing_test WHERE billing_no=?";
    var dataBilling = [resBillingNo];

    var sqlTrackingInItem = "SELECT tracking FROM billing_item_test where billing_no=?";
    var dataBillingNo = [resBillingNo];
 
    return new Promise(function(resolve, reject) {
      connection.query(sqlTrackingInItem,dataBillingNo, (error, results2, fields) => {
        if(results2.length>=0){
          connection.query(sqlCheckBilling,dataBilling, (error, results, fields) => {
            if(results.length<=0){
              connection.query(sqlSaveBilling,dataSaveBilling, (error, results122222, fields) => {
                resolve();
              });
            }
          });
        }
      })
      
      
    });
  },
  saveDataBillingItem: (billing_no,tracking,size_id,size_price,parcel_type,cod_value,source,address) => {
    // console.log(billing_no);
    let sender_name = address.sender_name;
    let sender_phone = address.sender_phone;
    let sender_address = address.sender_address;
    let receiver_name = address.receiver_name;
    let phone = address.phone;
    let receiver_address = address.receiver_address;
    let district_id = address.district_id;
    let district_name = address.district_name;
    let amphur_id = address.amphur_id;
    let amphur_name = address.amphur_name;
    let province_id = address.province_id;
    let province_name = address.province_name;
    let zipcode = address.zipcode;
    let remark = address.remark;

    var sqlSaveBillingItem ="INSERT INTO billing_item_test(billing_no, tracking, zipcode, size_id, size_price, parcel_type, cod_value, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    var dataBillintItem = [billing_no,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source];

    var sqlReceiver ="INSERT INTO billing_receiver_info_test(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var dataReceiver = [tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark];

    var sqlUpdateItemTemp = "UPDATE billing_item_temp SET billing_no = ? WHERE tracking = ?";
    var dataUpdateItemTemp = [billing_no, tracking];

    var sqlCheckDupTracking ="SELECT tracking,billing_no FROM billing_item_test where tracking=?";

    var sqlCheckDupReceiver ="SELECT tracking FROM billing_receiver_info_test WHERE tracking=?";
    var dataTracking = [tracking];

    return new Promise(function(resolve, reject) {
      /* check tracking ซ้ำ */
      connection.query(sqlCheckDupTracking,dataTracking, (error1, resultsItem, fields) => {
        if(error1===null){
          if(resultsItem.length<=0){
            /* save tracking ที่ไม่ซ้ำ */
            connection.query(sqlSaveBillingItem,dataBillintItem, (error, results, fields) => {
              resolve(billing_no)
            });
            connection.query(sqlUpdateItemTemp,dataUpdateItemTemp, (error, results, fields) => {});
          } else {
            resolve()
          }
        }
      });
      connection.query(sqlCheckDupReceiver,dataTracking, (error2, resultsReceiver, fields) => {
        if(error2===null){
          if(resultsReceiver.length<=0){
            connection.query(sqlReceiver,dataReceiver, (error, resultssss, fields) => {});
          }
        }
      });
      // console.log('return =>',billing_no)
    });
  },
  saveDataBillingReceiver: (tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark) => {
    var sql ="INSERT INTO billing_receiver_info_test(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var data = [tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveDataBillingItemTemp: (billing_no_temp,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source) => {
    var sql = "INSERT INTO billing_item_temp(billing_no, tracking, zipcode, size_id, size_price, parcel_type, cod_value, source) VALUES (?, ?,?, ?, ?, ?, ?, ?)";
    var data = [billing_no_temp,tracking,zipcode,size_id,size_price,parcel_type,cod_value,source];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  saveDataBillingReceiverTemp: (tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark) => {
    var sql ="INSERT INTO billing_receiver_info_temp(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    var data = [tracking,parcel_type,sender_name,sender_phone,sender_address,receiver_name,phone,receiver_address,district_id,district_name,amphur_id,amphur_name,province_id,province_name,zipcode,remark];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateDataBillingItemTemp: (billing_no, tracking) => {
    var sql = "UPDATE billing_item_temp SET billing_no = ? WHERE tracking = ?";
    var data = [billing_no, tracking];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  checkTracking: tracking => {
    var sql = "SELECT tracking FROM billing_item_test WHERE tracking = ?";
    var data = [tracking];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  },
  checkTrackingTemp: tracking => {
    var sql = "SELECT tracking FROM billing_item_temp WHERE tracking =  ?";
    var data = [tracking];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      });
    });
  },
  listBilling: branchId => {
    var status='cancel'
    var sql =
      "SELECT b.billing_no,b.timestamp,b.billing_date,b.member_code " +
      "FROM billing b " +
      "WHERE (DATE(b.billing_date)>= DATE_ADD(CURRENT_DATE(), INTERVAL -3 MONTH) AND Date(b.billing_date)<= CURRENT_DATE()) AND b.status != ? AND b.branch_id= ? " +
      "ORDER BY b.id DESC";
    var data = [status,branchId];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(results);
          }
        }
      });
    });
  },
  listDailyMember: branchId => {
    var sql =
      "SELECT b.member_code FROM billing b " +
      // "JOIN parcel_member p ON b.member_code=p.member_id " +
      "WHERE Date(b.billing_date)=CURRENT_DATE() AND b.branch_id= ? GROUP BY b.member_code";
    var data = [branchId];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (err === null) {
          if (results.length == 0) {
            resolve(false);
          } else {
            resolve(results);
          }
        }
      });
    });
  },
  testData: () => {
    var sql = "INSERT INTO test(name, ts, qty,tss) VALUES (?, ?, ?,?)";
    var data = ["hello2", new Date(), 1, +new Date()];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  }
};
