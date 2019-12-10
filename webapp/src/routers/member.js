const app = require('express').Router();
const memberService = require('../services/memberService.js');
const connection = require('../common/db.js');
const request = require('request');
const moment = require('moment');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
moment.locale('th')

app.post('/register', jsonParser, (req, res) => {

    var branch_id = req.body.branch_id
    var citizen_id = req.body.citizen_id
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var alias_name = req.body.alias_name
    var phone = req.body.phone
    var address = req.body.address
    var bank_issue = req.body.bank_issue
    var bank_branch_code = req.body.bank_branch_code
    var bankacc = req.body.bankacc
    var bank_acc_name = req.body.bankacc
    var img_citizen_id_url = req.body.img_citizen_id_url
    var img_book_bank_url = req.body.img_book_bank_url

    var username = phone
    var passcode = '';
    var bank_info_proven = 'pass';
    var status = 'active';
    var member_transfer_fee = 20;

    for (var i = 7; i < phone.length; i++) {
        passcode += phone[i];
    }

    memberService.countMemberMerId(branch_id).then(function(data) {
        var countMember = data[0].countMember;
        if (countMember == 0) {
            countMember++
        }
        var dataJson = {
            "branch_id": branch_id,
            "maxMember": countMember
        }

        request({
                url: "https://agent.whatitems.com/genmemberid/post",
                method: "POST",
                body: dataJson,
                json: true
            },
            (err, res2, body) => {
                var member_id = res2.body.memberId;

                memberService.saveRegister(member_id, branch_id, citizen_id, first_name, last_name, alias_name, address, phone, username, passcode, bankacc, bank_branch_code, bank_issue, bank_acc_name, bank_info_proven, member_transfer_fee, status, img_citizen_id_url, img_book_bank_url).then(function(data) {})
                res.json({ 'status': 'success' })
            })
    })

    // console.log(req.body)

})

app.get('/checkBank', (req, res) => {
    memberService.checkKeyinTrackingTemp().then(function(data) {
        res.json(data)
    });
})

module.exports = app;