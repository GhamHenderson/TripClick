var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2194',
    database: 'majorproject'
});

connection.connect();

module.exports = connection;