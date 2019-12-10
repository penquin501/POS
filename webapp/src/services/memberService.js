const connection = require('../common/db.js');
const bodyParser = require('body-parser');
const request = require('request');
const moment = require('moment');
moment.locale('th')

module.exports = {
    saveRegister: (member_id,branch_id, citizen_id, first_name, last_name, alias_name, address,phone,username,passcode, bankacc,bank_branch_code,bank_issue,bank_acc_name , bank_info_proven,member_transfer_fee,status, img_citizen_id_url, img_book_bank_url) => {

        let peak_value='';
        return new Promise(function(resolve, reject) {
            //let sql = "INSERT INTO `parcel_member_info`(`branch_id`,`member_code`, `citizen_id`, `first_name`, `last_name`, `alias_name`, `phone`, `address`, `zipcode`, `bank_id`, `bank_branch_code`, `bank_account_no`, `bank_acc_name`, `cod_permission`, `img_citizen_id_url`, `img_book_bank_url`) VALUES (" + branch_id + ",'" + membercode + "','" + citizen_id + "','" + first_name + "','" + last_name + "','" + alias_name + "','" + phone + "','" + address + "','" + zipcode + "'," + bank_id + ",'" + bank_branch_code + "','" + bank_account_no + "','" + bank_acc_name + "','" + cod_permission + "','" + img_citizen_id_url + "','" + img_book_bank_url + "')"
            let sql="INSERT INTO parcel_member(member_id, merid, citizenid, firstname, lastname, aliasname, ref_address, phoneregis, username, passcode, bankacc, bank_branch_code, bank_issue, bank_acc_name, bank_info_proven, member_transfer_fee, status, img_citizen_id_url, img_book_bank_url,peak_value) "+
            "VALUES ('"+member_id+"',"+branch_id+",'"+citizen_id+"','"+first_name+"','"+last_name+"','"+alias_name+"','"+address+"','"+phone+"','"+username+"','"+passcode+"','"+bankacc+"','"+bank_branch_code+"','"+bank_issue+"','"+bank_acc_name+"','"+bank_info_proven+"','"+member_transfer_fee+"','"+status+"','"+img_citizen_id_url+"','"+img_book_bank_url+"','"+peak_value+"')";
            connection.query(sql, (err, results) => {
                resolve(results)
            })
        })
    },
    countMemberMerId: (branch_id) => {
        return new Promise(function(resolve, reject) {
            
            let sql="SELECT count(*) as countMember FROM parcel_member WHERE merid="+branch_id;
            connection.query(sql, (err, results) => {
                
                resolve(results)
            })
        })
    },
    checkKeyinTrackingTemp: () => {
        return new Promise(function(resolve, reject) {
            let sql = "SELECT id,bank_th FROM global_bank_issue where status='active' "
            connection.query(sql, (error, results, fields) => {
                resolve(results)
            });
        })
    }
}