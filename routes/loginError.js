var express = require('express');
const session = require("express-session");
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('loginError', {
        // title: 'LoginError',
        error: 'Wrong password or username!'
    });
});

module.exports = router;