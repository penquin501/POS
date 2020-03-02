var mysql = require('mysql');
var connection = mysql.createPool({
    connectionLimit : 10,
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE_NAME,
    debug : false,
    timezone : '+07:00'
});

var connection2;
function handleDisconnect() {
    connection2 = mysql.createConnection(connection); // Recreate the connection, since
    connection2.connect(function(err) {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection2.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();
module.exports = connection;