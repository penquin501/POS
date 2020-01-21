// const connection945 = require('../common/db945.js');
const connection = require("../common/db.js");
const bodyParser = require("body-parser");
const request = require("request");
const moment = require("moment");
moment.locale("th");

module.exports = {
  checkDistrict: zipcode => {
    var sql = "SELECT district_code FROM postinfo_zipcodes WHERE zipcode = ?";
    var data = [zipcode];

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
  checkPrice: (code, size_name) => {
    var sql =
      "SELECT size_id,parcel_price FROM size_info where location_zone=? and alias_size= ?";
    var data = [code, size_name];

    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  checkZipcode: zipcode => {
    var sql =
      "SELECT p.PROVINCE_NAME FROM postinfo_zipcodes z " +
      "JOIN postinfo_district d ON z.district_code=d.DISTRICT_CODE " +
      "JOIN postinfo_province p ON d.PROVINCE_ID=p.PROVINCE_ID " +
      "WHERE z.zipcode=? GROUP BY p.PROVINCE_NAME";
    var data = [zipcode];

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
  checkSenderMember: tracking => {
    var sql = "SELECT phone_number FROM parcel_capture_data where barcode=?";
    var data = [tracking];

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
  checkTrackingBillItem: tracking => {
    var sql =
      "SELECT tracking FROM billing_item WHERE tracking =? AND (source is null or source ='KEYIN')";
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
  getReceipt: bill => {
    var sqlBilling =
      "SELECT b.billing_no,b.total,b.member_code,b.branch_id,bInfo.branch_name,b.timestamp,b.billing_date " +
      "FROM billing b " +
      "JOIN branch_info bInfo ON b.branch_id=bInfo.branch_id " +
      "WHERE billing_no=?";
    var dataBilling = [bill];

    var sqlBillingItem =
      "SELECT bItem.tracking,bItem.size_price,bItem.parcel_type,bItem.zipcode as bItemZipcode,s.alias_size, gSize.product_name," +
      "br.receiver_name,br.province_name,br.zipcode as bRzipcode,bItem.cod_value " +
      "FROM billing_item bItem " +
      "JOIN billing_receiver_info br ON bItem.tracking=br.tracking " +
      "JOIN size_info s ON bItem.size_id=s.size_id " +
      "JOIN global_parcel_size gSize ON s.alias_size=gSize.alias_name AND s.location_zone=gSize.area AND bItem.parcel_type=gSize.type " +
      "WHERE bItem.billing_no=? AND br.status!='cancel'";
    var dataBillItem = [bill];

    return new Promise(function(resolve, reject) {
      connection.query(sqlBilling, dataBilling, (err, resultBilling) => {
        if (err === null) {
          if (resultBilling.length == 0) {
            resolve(false);
          } else {
            connection.query(sqlBillingItem, dataBillItem,(err, resultBillingItem) => {
                if (err === null) {
                  if (resultBillingItem.length == 0) {
                    resolve(false);
                  } else {
                    var dataResult = {
                      billingInfo: resultBilling,
                      billingItem: resultBillingItem
                    };
                    resolve(dataResult);
                  }
                }
              }
            );
          }
        }
      });
    });
  },
  getReceiptMember: (member_code, branch_id) => {
    var sql =
      "SELECT b.member_code,b.billing_date,b.billing_no,b.branch_id,bInfo.branch_name,b.total,b.timestamp," +
      "bi.tracking,bi.size_price,bi.parcel_type,s.alias_size,bi.cod_value," +
      "br.receiver_name,br.province_name,br.zipcode " +
      "FROM billing b " +
      "JOIN billing_item bi ON b.billing_no=bi.billing_no " +
      "JOIN billing_receiver_info br ON bi.tracking=br.tracking " +
      "JOIN size_info s ON bi.size_id=s.size_id " +
      "JOIN branch_info bInfo ON b.branch_id=bInfo.branch_id " +
      "WHERE Date(b.billing_date) = CURRENT_DATE() AND b.branch_id=? AND b.member_code=?" +
      "ORDER BY b.billing_date ASC";
    var data = [branch_id, member_code];

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
  getType: bill => {
    var status='cancel'
    var sql =
      "SELECT bItem.parcel_type,count(bItem.parcel_type) as cType, sum(cod_value) as sumCOD " +
      "FROM billing b JOIN billing_item bItem on b.billing_no=bItem.billing_no " +
      "JOIN billing_receiver_info br on bItem.tracking=br.tracking " +
      "WHERE b.billing_no=? AND br.status != ?" +
      "GROUP by bItem.parcel_type ORDER BY parcel_type ASC";
    var data = [bill,status];

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
  getMemberBillType: (member_code, branch_id) => {
    var sql =
      "SELECT bi.parcel_type,count(bi.parcel_type) as cType, sum(cod_value) as sumCOD " +
      "FROM billing b " +
      "JOIN billing_item bi " +
      "ON b.billing_no=bi.billing_no " +
      "WHERE Date(b.billing_date) = CURRENT_DATE() AND b.branch_id=? AND b.member_code= ?" +
      "GROUP by bi.parcel_type ORDER BY parcel_type ASC";
    var data = [branch_id, member_code];

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
  savePrintBill: (
    billing_no,
    total,
    first_name,
    member_code,
    branch_id,
    branch_name,
    timestamp,
    tracking,
    size_price,
    parcel_type,
    alias_size,
    receiver_name,
    province_name,
    zipcode,
    cod_value,
    count
  ) => {
    var status = "U";
    var sql =
      "INSERT INTO printbill(billing_no, total, first_name, member_code, branch_id, branch_name, timestamp, tracking, size_price, parcel_type,alias_size, receiver_name, province_name, zipcode,status,cod_value,count) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var data = [
      billing_no,
      total,
      first_name,
      member_code,
      branch_id,
      branch_name,
      timestamp,
      tracking,
      size_price,
      parcel_type,
      alias_size,
      receiver_name,
      province_name,
      zipcode,
      status,
      cod_value,
      count
    ];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {});
    });
  },
  checkTrackingNo: billing_no => {
    var sql =
      "SELECT count(tracking) as cTracking FROM billing_item WHERE billing_no=?";
    var data = [billing_no];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        if (results.length != 0) {
          resolve(results);
        }
      });
    });
  },
  updateStatusInBilling: (status, billing_no) => {
    var sql = "UPDATE billing SET status=?,sending_date=? WHERE billing_no=?";
    var data = [status, new Date(), billing_no];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateStatusInReceiver: (status, tracking) => {
    var sql =
      "UPDATE billing_receiver_info SET status=?,sending_date=? WHERE tracking=?";
    var data = [status, new Date(), tracking];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  },
  updateResponseData: (raw_data, billing_no) => {
    var sql =
      "UPDATE billing SET response_json=?,sending_date=? WHERE billing_no=?";
    var data = [raw_data, new Date(), billing_no];
    return new Promise(function(resolve, reject) {
      connection.query(sql, data, (err, results) => {
        resolve(results);
      });
    });
  }
};
