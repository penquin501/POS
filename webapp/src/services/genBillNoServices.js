const connection945 = require('../common/db945.js');
const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    getPhoneno: (phoneno) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT id,merid FROM global_authen WHERE phoneno =" + phoneno + " "
            connection945.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },
    getUsername: (username) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT member_id,merid FROM parcel_member where username=" + username + " "
            connection945.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },
    getCapture: (phoneno) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT phone_number FROM parcel_capture_data where phone_number= '" + phoneno + "' "
            connection.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },

    checkDistrict: (zipcode) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT district_code FROM postinfo_zipcodes WHERE zipcode = '" + zipcode + "'"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    checkZipcode: (zipcode) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT p.PROVINCE_NAME FROM postinfo_zipcodes z JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID " +
                "WHERE z.zipcode='" + zipcode + "' GROUP BY p.PROVINCE_NAME"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    checkPrice: (code, size_name) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT size_id,parcel_price FROM size_info where location_zone='" + code + "' and alias_size= '" + size_name + "' "
            connection.query(sql, (error, results, fields) => {
                resolve(results);
            });
        })
    },
    checkSenderMember: (tracking) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT phone_number FROM parcel_capture_data where barcode='" + tracking + "' "
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    checkTrackingBillItem: (tracking) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT tracking FROM billing_item WHERE tracking ='" + tracking + "' AND (source is null or source ='KEYIN')"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(true);
                }
            });
        })
    },
    getReceipt: (bill) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT b.billing_no,b.total,b.member_code,b.branch_id,bInfo.branch_name,b.timestamp,bItem.tracking,bItem.size_price,bItem.parcel_type,s.alias_size,br.receiver_name,br.province_name,br.zipcode,bItem.cod_value " +
                "FROM billing b " +
                "JOIN billing_item bItem ON b.billing_no=bItem.billing_no " +
                "JOIN billing_receiver_info br ON bItem.tracking=br.tracking " +
                "JOIN size_info s ON bItem.size_id=s.size_id " +
                "JOIN branch_info bInfo ON b.branch_id=bInfo.branch_id " +
                "WHERE b.billing_no='" + bill + "'"

            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    getReceiptMember: (member_code, branch_id) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT b.member_code,b.billing_date,b.billing_no,b.branch_id,bInfo.branch_name,b.total,b.timestamp,bi.tracking,bi.size_price,bi.parcel_type,s.alias_size,bi.cod_value," +
                "br.receiver_name,br.province_name,br.zipcode " +
                "FROM billing b " +
                "JOIN billing_item bi " +
                "ON b.billing_no=bi.billing_no " +
                "JOIN billing_receiver_info br " +
                "ON bi.tracking=br.tracking " +
                "JOIN size_info s " +
                "ON bi.size_id=s.size_id " +
                "JOIN branch_info bInfo " +
                "ON b.branch_id=bInfo.branch_id " +
                "WHERE Date(b.billing_date) = CURRENT_DATE() AND b.branch_id='" + branch_id + "' AND b.member_code= '" + member_code + "' " +
                "ORDER BY b.billing_date ASC"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    getType: (bill) => {
        return new Promise(function (resolve, reject) {
            // let sql = "SELECT bItem.parcel_type,count(bItem.parcel_type) as cType, sum(cod_value) as sumCOD FROM billing b JOIN billing_item bItem on b.billing_no=bItem.billing_no join billing_receiver_info br on bItem.tracking=br.tracking where b.billing_no='" + bill + "' GROUP by bItem.parcel_type ORDER BY cType ASC"
            let sql = "SELECT bItem.parcel_type,count(bItem.parcel_type) as cType, sum(cod_value) as sumCOD FROM billing b JOIN billing_item bItem on b.billing_no=bItem.billing_no join billing_receiver_info br on bItem.tracking=br.tracking where b.billing_no='" + bill + "' GROUP by bItem.parcel_type ORDER BY parcel_type ASC"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    getMemberBillType: (member_code, branch_id) => {
        return new Promise(function (resolve, reject) {
            let sql = "SELECT bi.parcel_type,count(bi.parcel_type) as cType, sum(cod_value) as sumCOD " +
                "FROM billing b " +
                "JOIN billing_item bi " +
                "ON b.billing_no=bi.billing_no " +
                "WHERE Date(b.billing_date) = CURRENT_DATE() AND b.branch_id=" + branch_id + " AND b.member_code= '" + member_code + "'" +
                "GROUP by bi.parcel_type ORDER BY parcel_type ASC"
            connection.query(sql, (error, results, fields) => {
                if (!results.length) {
                    resolve(false)
                } else {
                    resolve(results);
                }
            });
        })
    },
    savePrintBill: (billing_no, total, first_name, member_code, branch_id, branch_name, timestamp, tracking, size_price, parcel_type, alias_size, receiver_name, province_name, zipcode,cod_value,count) => {
        return new Promise(function (resolve, reject) {
            var status = 'U'
            let sql = "INSERT INTO printbill (billing_no, total, first_name, member_code, branch_id, branch_name, timestamp, tracking, size_price, parcel_type,alias_size, receiver_name, province_name, zipcode,status,cod_value,count) VALUES ('" + billing_no + "'," + total + ",'" + first_name + "','" + member_code + "'," + branch_id + ",'" + branch_name + "','" + timestamp + "','" + tracking + "'," + size_price + ",'" + parcel_type + "','" + alias_size + "','" + receiver_name + "','" + province_name + "','" + zipcode + "','" + status + "',"+cod_value+","+count+")"
            console.log(sql)
            connection.query(sql, (err, results) => {})
        })
    }
}