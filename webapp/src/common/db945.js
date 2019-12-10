var mysql = require('mysql');
var connection945 = mysql.createConnection({
    host: '35.247.132.242',
    user: 'symfony',
    password: 'Symfony123',
    database: 'database945ffm'
});
var connection2;
function handleDisconnect() {
    connection2 = mysql.createConnection(connection945); // Recreate the connection, since
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
module.exports = connection945;