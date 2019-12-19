const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    getZipcode: (zipcode) => {
        var sql="SELECT z.district_code as DISTRICT_CODE,z.zipcode,d.DISTRICT_ID,d.DISTRICT_NAME,a.AMPHUR_ID,a.AMPHUR_NAME,p.PROVINCE_ID,p.PROVINCE_NAME "+
        "FROM postinfo_zipcodes z "+
        "JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE "+
        "JOIN postinfo_amphur a ON d.AMPHUR_ID=a.AMPHUR_ID "+
        "JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID "+
        "WHERE z.zipcode LIKE ?"

        var data = [zipcode+'%'];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        });
    },
    deleteItemTemp: (id) => {
        var sql="DELETE FROM billing_item_temp WHERE tracking = ?"
        var data=[id]
        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results);
            });
        })
    },
    deleteReceiverTemp: (id) => {
        var sql="DELETE FROM billing_receiver_info_temp WHERE tracking = ?"
        var data=[id]
        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results);
            });
        })
    },
    getListReceiver: (billing_no) => {
        var sql="SELECT DISTINCT billing_item.tracking,billing_item.parcel_type,billing_item.size_price,billing_receiver_info.receiver_name,billing_receiver_info.district_name,billing_receiver_info.amphur_name,billing_receiver_info.province_name,billing_receiver_info.zipcode,billing.total,billing_receiver_info.status FROM billing LEFT JOIN billing_item ON billing.billing_no = billing_item.billing_no LEFT JOIN billing_receiver_info ON billing_item.tracking = billing_receiver_info.tracking WHERE billing.billing_no = ?"
        var data=[billing_no]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results);
            });
        })
    },
    saveDataBilling: (user_id,mer_authen_level,member_code,carrier_id, billing_no, branch_id, total, img_url) => {
        var dateTimestamp = new Date();
        var dateTimestamp2 = +dateTimestamp
        // var dateTimeString = moment(new Date).format("YYYY-MM-DD HH:mm:ss", true);

        var sql="INSERT INTO billing(user_id,mer_authen_level,member_code,carrier_id,billing_date,billing_no,branch_id,total,timestamp,img_url) VALUES (?,?,?,?,?,?,?,?,?,?)"
        var data = [user_id,mer_authen_level,member_code,carrier_id,new Date(), billing_no, branch_id, total,dateTimestamp2, img_url];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataBillingItem: (billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source) => {
        
        var sql="INSERT INTO billing_item(billing_no, tracking, zipcode, size_id, size_price, parcel_type, cod_value, source) VALUES (?, ?,?, ?, ?, ?, ?, ?)"
        var data = [billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataBillingReceiver: (tracking,parcel_type,sender_name,sender_phone,sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) => {
        
        var sql="INSERT INTO billing_receiver_info(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        var data = [tracking,parcel_type,sender_name,sender_phone,sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataBillingItemTemp: (billing_no_temp, tracking,zipcode, size_id, size_price, parcel_type, cod_value,source) => {
        
        var sql="INSERT INTO billing_item_temp(billing_no, tracking, zipcode, size_id, size_price, parcel_type, cod_value, source) VALUES (?, ?,?, ?, ?, ?, ?, ?)"
        var data = [billing_no, tracking,zipcode, size_id, size_price, parcel_type, cod_value, source];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    saveDataBillingReceiverTemp: (tracking,parcel_type,sender_name,sender_phone,sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) => {
        var sql="INSERT INTO billing_receiver_info_temp(tracking, parcel_type, sender_name, sender_phone, sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        var data = [tracking,parcel_type,sender_name,sender_phone,sender_address, receiver_name, phone, receiver_address, district_id, district_name, amphur_id, amphur_name, province_id, province_name, zipcode, remark];

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    updateDataBillingItemTemp: (billing_no, tracking) => {
        var sql="UPDATE billing_item_temp SET billing_no = ? WHERE tracking = ?";
        var data = [billing_no, tracking]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        })
    },
    checkTracking: (tracking) => {
        var sql="SELECT tracking FROM billing_item WHERE tracking = ?";
        var data = [tracking]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        })
    },
    checkTrackingTemp: (tracking) => {
        var sql="SELECT tracking FROM billing_item_temp WHERE tracking =  ?";
        var data = [tracking]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        })
    },
    listBilling: (branchId) => {

        var sql="SELECT b.billing_no,b.timestamp,m.firstname,m.lastname FROM billing b JOIN parcel_member m ON b.member_code=m.member_id WHERE (DATE(b.billing_date)>= DATE_ADD(CURRENT_DATE(), INTERVAL -3 MONTH) AND Date(b.billing_date)<= CURRENT_DATE())AND b.branch_id= ? ORDER BY b.billing_date DESC";
        var data = [branchId]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        })
    },
    listDailyMember: (branchId) => {
        var sql = "SELECT b.member_code,p.firstname,p.lastname FROM billing b "+
        "JOIN parcel_member p ON b.member_code=p.member_id "+
        "WHERE Date(b.billing_date)=CURRENT_DATE() AND b.branch_id= ? GROUP BY b.member_code,p.firstname,p.lastname"
        var data = [branchId]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        })
    },
    selectDataInBillNo: (bill_no) => {
        let sql ="SELECT b.member_code,b.carrier_id,b.billing_no,b.branch_id,b.total,b.img_url,"+
        "bItem.tracking,bItem.size_id,bItem.size_price,bItem.parcel_type,bItem.cod_value,"+
        "br.sender_name,br.sender_phone,br.sender_address,br.receiver_name,br.phone,br.receiver_address,d.DISTRICT_CODE,br.district_name,a.AMPHUR_CODE,br.amphur_name,p.PROVINCE_CODE,br.province_name,br.zipcode,br.remark,"+
        "s.location_zone,s.alias_size,gSize.product_id,gSize.product_name,g.GEO_ID,g.GEO_NAME "+
        "FROM billing b "+
        "JOIN billing_item bItem ON b.billing_no=bItem.billing_no "+
        "JOIN billing_receiver_info br ON bItem.tracking=br.tracking "+
        "JOIN size_info s ON s.size_id=bItem.size_id "+
        "JOIN global_parcel_size gSize ON s.location_zone = gSize.area AND s.alias_size =gSize.alias_name AND bItem.parcel_type= gSize.type "+
        "JOIN postinfo_district d ON br.district_id=d.DISTRICT_ID and br.amphur_id=d.AMPHUR_ID and br.province_id=d.PROVINCE_ID "+
        "JOIN postinfo_amphur a ON br.amphur_id=a.AMPHUR_ID "+
        "JOIN postinfo_province p ON br.province_id=p.PROVINCE_ID "+
        "JOIN postinfo_geography g ON d.GEO_ID=g.GEO_ID "+
        "WHERE bItem.billing_no= ? ";
        var data = [bill_no]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        });
      },
      updateStatusBilling: (bill_no,status) =>{
        let sql="UPDATE billing SET status=? WHERE billing_no=?"
        var data = [status,bill_no]
        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        });
      },
      updateStatusReceiverInfo: (tracking,status) =>{
        // var dateTimeString = moment(new Date).format("YYYY-MM-DD HH:mm:ss", true);
        let sql="UPDATE billing_receiver_info SET status=?,sending_date=? WHERE tracking=?"
        var data = [status,new Date(),tracking]

        return new Promise(function(resolve, reject) {
            connection.query(sql, data, (err, results) => {
                resolve(results)
            });
        });
      }
    
}