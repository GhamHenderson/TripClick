const dotenv = require('dotenv');
dotenv.config({path: './.env'});
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    port: 25060,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Connected to Database.")
        // console.log(process.env)
    }
})
module.exports = {
    connection
}