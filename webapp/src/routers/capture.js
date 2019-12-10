const app = require('express').Router();
const captureService = require('../services/captureService.js');
const connection = require('../common/db.js');
const request = require('request');
const moment = require('moment');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
moment.locale('th')

app.post('/addCapture', jsonParser, (req, res) => {
    let rawData = JSON.stringify(req.body)
    let data = req.body

    let ref = data.ref;
    let dataType = data.dataType;
    let owner = data.owner;
    let phoneNumber = data.phoneNumber;
    let barcodes = data.barcodes;

    for (i = 0; i < barcodes.length; i++) {
        let imageUrl = barcodes[i].imageUrl;
        let imagePath = barcodes[i].imagePath;
        let code = barcodes[i].code;
        captureService.saveDataCapture(ref, owner, phoneNumber, imageUrl, imagePath, code, rawData).then(function(data) {})
        captureService.saveDataCaptureBillingItem(code).then(function(data) {})
        captureService.saveDataCaptureBillingReceiverInfo(code).then(function(data) {})
    }
    res.json({status:'Complete'})

})


module.exports = app;