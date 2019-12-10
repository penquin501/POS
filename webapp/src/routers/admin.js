const app = require('express').Router();
const adminService = require('../services/adminService.js');
const connection = require('../common/db945.js');
const request = require('request');
const moment = require('moment');
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
moment.locale('th')

app.get('/trackingAll', (req, res) => {
    adminService.getTracking().then(function(data) {
        res.json(data)
    });
});

app.get('/trackingAllKeyin', (req, res) => {
    let tracking = req.query.tracking
    adminService.getTrackingKeyin(tracking).then(function(data) {
        res.json(data)
    });
});

module.exports = app;
