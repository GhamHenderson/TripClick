var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var customsRouter = require('./routes/customs');

var app = express();

app.set('trust proxy', 1);// trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false} // this bit is important or it will keep making a new session by accident!
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/customs', customsRouter);
app.use('/users', usersRouter);

// app.get('/register', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
//     res.render('register')
// });

// app.get('/login', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
//     res.render('login')
// });
//
// app.get('/customs', (req, res) => {    //here you can include a new "about" route that should take you to the "about" page
//     res.render('customs')
// });

//register form send into database
// app.get('/register', function (req, res) {
//
//     console.log("hello");
//     res.send("all ok")
//
// });

app.use(express.json())
//middleware to read req.body.<params>

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

    var errorMessage = '';

    //get the library
    var validator = require('validator');
    //run the validator
    var emailValid = validator.isEmail(email); //true
    //check the response
    console.log(emailValid);

    if (email.length == '') {
        errorMessage += 'Please enter a valid email address!!<br>';
    } else if (emailValid == false) {
        errorMessage += 'Email address is not valid. Please enter a valid email address!!<br>';
    } else if (email.length > 40) {
        errorMessage += 'Email address is too long. Maximum length allowed it 40 characters!<br>';
    }

    if (password.length == '') {
        errorMessage += 'Please enter a password! <br>';
    } else if (password.length < 8) {
        errorMessage += 'Password too short. Minimum characters should be 8! <br>';
    } else if (password.length > 25) {
        errorMessage += 'Password too long. Maximum length allowed is 25 characters! <br>';
    }


    if (username.length == '') {
        errorMessage += 'Please enter a username! <br>';
    } else if (username.length < 6) {
        errorMessage += 'Username too short. Minimum characters should be 6! <br>';
    } else if (username.length > 15) {
        errorMessage += 'Username too long. Maximum length allowed is 15 characters! <br>';
    }

    var xss = require("xss");
    username = xss(username);

    var emojiStrip = require('emoji-strip');
    username = emojiStrip(username);

    var sqlString = require('sqlstring');
    var cleanedUsername = sqlString.escape(username);

    username = cleanedUsername;

    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPass = bcrypt.hashSync(password, salt);

    password = hashPass;


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

    //if the length of the error is > than 0 send back the error
    if (errorMessage.length > 0) {
        res.send(errorMessage);
    } else {
        // console.log("first name = " + firstname);
        // console.log("last name = " + lastname);
        // console.log("User name = " + username);
        // console.log("pass = " + password);
        // console.log("email = " + email);
        // console.log("phone = " + phone);
        // console.log("gender = " + gender);
        // console.log("country = " + country);
        // console.log("city = " + city);

        var valid = true;
        var validator = require('validator');

        var response = validator.isEmail(email);

        if (response = false) {
            valid = false;
        }

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
        connection.query("INSERT INTO `majorproject`.`users` (`firstname`, `lastname`, `username`, `password`, `email`, `phonenum`, `gender`, `country`, `city`) VALUES ('" + firstname + "', '" + lastname + "', " + username + ", '" + password + "', '" + email + "', '" + phone + "', '" + gender + "', '" + country + "', '" + city + "');", function (error, results, fields) {
            if (error) throw error;

        });

        connection.end();

        res.send("Registered!");

    }
});


app.post('/login', function (req, res) {

    // catch the username that was sent to us from the jQuery POST on the index.ejs page
    var username = req.body.username;
    var password = req.body.password;

    var errorMessage = '';

    const bcrypt = require('bcrypt');
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Database2001',
        database: 'majorproject'
    });

    connection.connect();

    // This is the actual SQL query part
    // if (username && password) {
    connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, result) {
        if (error) throw error;

        if (result.length == 0) {
            console.log("--------> User does not exist");
        } else {
            const hashedPassword = result[0].password
            //get the hashedPassword from result
            if (bcrypt.compare(password, hashedPassword)) {
                console.log("---------> Login Successful")
                res.send(`${username} is logged in!`)
            } else {
                console.log("---------> Password Incorrect")
                res.send("Password incorrect!")
            } //end of bcrypt.compare()
        }

    });

    connection.end();

    req.session.username = username;

    console.log(req.session.username);

});

// app.get('/customs', function (request, response) {
//     console.log("User logged" + request.session.loggedin);
//     if (request.session.loggedin) {
//         response.render('customs');
//         response.send('Welcome back, ' + request.session.username + '!');
//     } else {
//         response.send('Please login to view this page!');
//     }
//     response.end();
// });

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
