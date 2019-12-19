const express = require('express');
const twig = require('twig');
const app = express();
const port = process.env.PORT || 3100;
const path = require('path');
app.use(express.static("public"));


app.set('view engine', 'twig');
app.set('view cache', false);
twig.cache(false);

app.use(express.json())

const bill = require('./routers/billingPos');
const capture = require('./routers/capture');
const genBillNo = require('./routers/genBillNo');
const quicklink = require('./routers/quicklink');
const keyin = require('./routers/keyin');
const printBill = require('./routers/printBill');
const printPdf = require('./routers/printPdf');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next()
})
app.use('/billingPos', bill)
app.use('/capture', capture)
app.use('/genBillNo', genBillNo)
app.use('/quicklink', quicklink)
app.use('/keyin', keyin)
app.use('/printBill', printBill)
app.use('/printPdf', printPdf)

app.get("/*", function(req, res) {
    res.sendFile(path.resolve("public/index.html"));
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));


// This section is optional and used to configure twig.
app.set("twig options", {
    allow_async: true, // Allow asynchronous compiling
    strict_variables: false
});
app.listen(9999);
