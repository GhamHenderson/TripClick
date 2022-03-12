var express = require('express');
const session = require("express-session");
var router = express.Router();

router.get('/', function (req, res, next) {
    // var {firstname} = req.session.firstname;

    res.render('userInfo', {
        title: 'Personal Profile',
        username: req.session.username,
        firstname: req.session.firstname,
        lastname: req.session.lastname,
        // password: req.session.password,
        email: req.session.email,
        phone: req.session.phone,
        gender: req.session.gender,
        country: req.session.country,
        city: req.session.city,
        dateRegister: req.session.dateRegister
    });
});

module.exports = router;