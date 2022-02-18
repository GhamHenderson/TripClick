var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Database2001',
    database: 'majorproject'
});

connection.connect();

module.exports = connection;