var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
    host: '178.128.80.22',
    user: 'parceldev',
    password: '123456',
    database: 'parcel',
    debug    :  false
});

var connection2;
function handleDisconnect() {
    connection2 = mysql.createConnection(connection); // Recreate the connection, since
    connection2.connect(function(err) {
        if (err) {
            // console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection2.on('error', function(err) {
        // console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();
module.exports = connection;