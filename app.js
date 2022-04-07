var createError = require('http-errors');
const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const validator = require("validator");
const xss = require("xss");
const emojiStrip = require("emoji-strip");
const sqlString = require("sqlstring");
// const {JWT_SECRET, SENDMAIL_KEY} = require('./configHide');
const {connection} = require('./dbConnection');

dotenv.config({path: './.env'});

const app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');
var customsRouter = require('./routes/customs');
var graphRouter = require('./routes/graph');
var userInfoRouter = require('./routes/userInfo');
var editDetailsRouter = require('./routes/editDetails');

const HALF_HOUR = 1000 * 60 * 30

const {
    NODE_ENV = 'development',
    SESS_NAME = 'sid',
    SESS_SECRET = 'keyboard cat',
    SESS_LIFETIME = HALF_HOUR
} = process.env

const IN_PROD = NODE_ENV === 'production'

app.use(express.json())
//middleware to read req.body.<params>

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.set('trust proxy', 1);// trust first proxy
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: true,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        samSite: true,
        secure: IN_PROD
    }
}));

app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/customs', customsRouter);
app.use('/users', usersRouter);
app.use('/graph', graphRouter);
app.use('/userInfo', userInfoRouter);
app.use('/editDetails', editDetailsRouter);

const transporter = nodeMailer.createTransport(sendGridTransport({
    auth: {
        api_key: process.env.SENDMAIL_KEY
    }
}));

app.post('/register', (req, res) => {

    // catch the username that was sent to us from the jQuery POST on the index.ejs page
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.passwordConfirm;
    var email = req.body.email;
    var phone = req.body.phone;
    var gender = req.body.gender;
    var country = req.body.country;
    var city = req.body.city;

    var errorMessage = '';

    var valid = true;
    var emailValid = validator.isEmail(email); //true

    if (emailValid == false) {
        valid = false;
    }
    // console.log(emailValid);

    if (email.length === '') {
        errorMessage += 'Please enter a valid email address!!';
    } else if (emailValid === false) {
        errorMessage += 'Email address is not valid. Please enter a valid email address!!';
    } else if (email.length > 40) {
        errorMessage += 'Email address is too long. Maximum length allowed it 40 characters!';
    }

    if (password.length === '') {
        errorMessage += 'Please enter a password!';
    } else if (password.length < 8) {
        errorMessage += 'Password too short. Minimum characters should be 8!';
    } else if (password.length > 25) {
        errorMessage += 'Password too long. Maximum length allowed is 25 characters!';
    }


    if (username.length === '') {
        errorMessage += 'Please enter a username!';
    } else if (username.length < 6) {
        errorMessage += 'Username too short. Minimum characters should be 6!';
    } else if (username.length > 15) {
        errorMessage += 'Username too long. Maximum length allowed is 15 characters!';
    }

    username = xss(username);

    username = emojiStrip(username);

    // var cleanedUsername = sqlString.escape(username);


    if (errorMessage.length > 0) {
        res.status(422).json({error: errorMessage});
    } else {
        if (!firstname || !lastname || !username || !password || !confirmPassword || !email || !phone || !gender || !country || !city) {
            return res.status(422).json({error: "Please fill in all the fields!"});
        } else {
            connection.query('SELECT email from users WHERE email = ?', [email], (error, result) => {
                if (error) {
                    console.log(error);
                }

                if (result.length > 0) {
                    return res.status(422).json({error: "This email is already associated with an account!"});
                } else {
                    connection.query('SELECT username from users WHERE username = ?', [username], async (error, result) => {
                        if (error) {
                            console.log(error);
                        }

                        if (result.length > 0) {
                            return res.status(422).json({error: "This username is already in use!"});
                        } else if (password !== confirmPassword) {
                            return res.status(422).json({error: "Passwords do not match!"});
                        }

                        let hashedPassword = await bcryptjs.hash(password, 10);

                        password = hashedPassword;
                        console.log(password);

                        connection.query('INSERT INTO users SET ?', {
                            firstname: firstname,
                            lastname: lastname,
                            username: username,
                            password: password,
                            email: email,
                            phone: phone,
                            gender: gender,
                            country: country,
                            city: city
                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                            } else {
                                transporter.sendMail({
                                    to: email,
                                    from: "iacobedy2001@gmail.com",
                                    subject: "Account created successfully!",
                                    html: "<p>Welcome to our website. Please log in using your username and password!<>https://tripclick.live/login</p>"
                                });
                                req.session.save();
                                res.redirect('/login');
                            }
                        });
                    });
                }
            });
        }
    }
});


app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    // This is the actual SQL query part
    if (!username || !password) {
        return res.status(422).json({error: "Please enter your username and password!"});
    } else {
        connection.query("SELECT * FROM users WHERE username = ?", [username], function (error, result) {
            if (error) throw error;

            if (result.length === 0) {
                return res.status(422).json({error: "Wrong username or password!"});
            } else {
                const hashedPassword = result[0].password
                //get the hashedPassword from result
                var finalResult = bcryptjs.compareSync(password, hashedPassword);

                if (finalResult === true) {
                    req.session.username = username;
                    req.session.userId = result[0].userId;
                    req.session.firstname = result[0].firstname;
                    req.session.lastname = result[0].lastname;
                    req.session.email = result[0].email;
                    req.session.phone = result[0].phone;
                    req.session.gender = result[0].gender;
                    req.session.country = result[0].country;
                    req.session.city = result[0].city;
                    req.session.dateRegister = result[0].dateRegister;
                    // const token = jwt.sign({_userId: result[0].userId}, JWT_SECRET);
                    // res.json({token});
                    res.redirect('/');
                } else {
                    return res.status(422).json({error: "Wrong username or password!"});
                }
            }
        });
    }
});

app.post('/editDetails', function (req, res, next) {
    var userId = req.session.userId;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
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

    if (email.length === '') {
        errorMessage += 'Please enter a valid email address!!';
    } else if (emailValid === false) {
        errorMessage += 'Email address is not valid. Please enter a valid email address!!';
    } else if (email.length > 40) {
        errorMessage += 'Email address is too long. Maximum length allowed it 40 characters!';
    }


    if (username.length === '') {
        errorMessage += 'Please enter a username!';
    } else if (username.length < 6) {
        errorMessage += 'Username too short. Minimum characters should be 6!';
    } else if (username.length > 15) {
        errorMessage += 'Username too long. Maximum length allowed is 15 characters!';
    }

    var xss = require("xss");
    username = xss(username);

    var emojiStrip = require('emoji-strip');
    username = emojiStrip(username);

    var sqlString = require('sqlstring');
    var cleanedUsername = sqlString.escape(username);

    username = cleanedUsername;
    //if the length of the error is > than 0 send back the error
    if (errorMessage.length > 0) {
        return res.status(422).json({error: errorMessage});
    } else {

        var valid = true;
        var validator = require('validator');

        var response = validator.isEmail(email);

        if (response == false) {
            valid = false;
        }
        // This is the actual SQL query part
        connection.query("UPDATE `majorproject`.`users` SET  `firstname` = '" + firstname + "', `lastname` = '" + lastname + "', `username` = " + username + ", `email` = '" + email + "', `phone` = '" + phone + "', `gender` = '" + gender + "', `country` = '" + country + "', `city` = '" + city + "' WHERE `userId` = '" + userId + "';", function (error, result, fields) {
            if (error) throw error;


        });
    }

    req.session.destroy();
    res.redirect('/login');
});

app.post('/deleteAccount', function (req, res) {
    var userId = req.session.userId;

    connection.query("DELETE FROM `majorproject`.`users` WHERE  `userId`= '" + userId + "';", function (error, results, fields) {
        if (error) throw error;

    });

    req.session.destroy();
    res.redirect('login');
});


app.post('/logout', function (req, res) {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/');
        }
        res.clearCookie(SESS_NAME)
        res.redirect('/login');
    });
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
