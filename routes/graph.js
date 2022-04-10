var express = require('express');
const session = require("express-session");
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('graph', {
        title: 'Graph',
        message: '',
        error: '',
        userId: req.session.userId,
        username: req.session.username,
        firstname: req.session.firstname,
        lastname: req.session.lastname,
        email: req.session.email,
        phone: req.session.phone,
        gender: req.session.gender,
        country: req.session.country,
        city: req.session.city,
        dateRegister: req.session.dateRegister,
        role: req.session.role

    });
});

module.exports = router;