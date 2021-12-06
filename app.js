var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/register', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
    res.render('register')
});

app.get('/login', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
    res.render('login')
});

app.get('/customs', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
    res.render('customs')
});

//register form send into database
app.get('/register', function (req, res) {

    console.log("hello");
    res.send("all ok")

});

app.post('/register', function (req, res) {

    // catch the username that was sent to us from the jQuery POST on the index.ejs page
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var phone = req.body.phone;
    var gender = req.body.gender;
    var country = req.body.country;
    var city = req.body.city;


    // Print it out to the NodeJS console just to see if we got the variable.
    console.log("first name = " + firstname);
    console.log("last name = " + lastname);
    console.log("User name = " + username);
    console.log("pass = " + password);
    console.log("email = " + email);
    console.log("phone = " + phone);
    console.log("gender = " + gender);
    console.log("country = " + country);
    console.log("city = " + city);


    // Remember to check what database you are connecting to and if the
    // values are correct.
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Database2001',
        database: 'majorproject'
    });

    connection.connect();

    // This is the actual SQL query part
    connection.query("INSERT INTO `majorproject`.`users` (`firstname`, `lastname`, `username`, `password`, `email`, `phonenum`, `gender`, `country`, `city`) VALUES ('" + firstname + "', '" + lastname + "', '" + username + "', '" + password + "', '" + email + "', '" + phone + "', '" + gender + "', '" + country + "', '" + city + "');", function (error, results, fields) {
        if (error) throw error;

        res.send("all ok");
    });

    connection.end();

});

app.get('/login', function (req, res) {

    console.log("hello");
    res.send("all ok")

});

app.post('/login', function (req, res) {

    // catch the username that was sent to us from the jQuery POST on the index.ejs page
    var username = req.body.username;
    var password = req.body.password;

    // Print it out to the NodeJS console just to see if we got the variable.
    console.log("User name = " + username);
    console.log("Password = " + password);


    // Remember to check what database you are connecting to and if the
    // values are correct.
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Database2001',
        database: 'majorproject'
    });

    connection.connect();

    // This is the actual SQL query part
    connection.query("select * from users where username='" + username + "' AND password='" + password + "';", function (error, results, fields) {
        if (error) throw error;
        res.send("all ok");


    });

    connection.end();

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
