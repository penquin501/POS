const app = require("express").Router();
const captureService = require("../services/captureService.js");
const connection = require("../common/db.js");
const request = require("request");
const moment = require("moment");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
moment.locale("th");

app.post("/addCapture", jsonParser, (req, res) => {
  let rawData = JSON.stringify(req.body);
  let data = req.body;

  let ref = data.ref;
  let dataType = data.dataType;
  let owner = data.owner;
  let phoneNumber = data.phoneNumber;
  let barcodes = data.barcodes;

  codes = {}
  barcodes.forEach((value)=>{
    console.log("save capture =>",value.code);
    if (! (value.code in codes)) {
      codes[String(value.code)] = value;
    }
  })
  var objCodes=Object.values(codes);

  let saveItem = async () => {
    await objCodes.forEach(async val => {
      let imageUrl = val.imageUrl;
      let imagePath = val.imagePath;
      let code = val.code;

      await captureService.checkDataCapture(ref,owner,phoneNumber,imageUrl,imagePath,code,rawData);
    });
    return true;
  };
  saveItem().then(result => {
    if (result) {
      res.json({ status: "Complete" });
    }
  });
});

module.exports = app;
