var express = require('express');
const session = require("express-session");
var router = express.Router();
const {ROLE} = require('../roles');
const redirectLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login')
    } else {
        next()
    }
}


router.get('/', redirectLogin, function (req, res, next) {

    res.render('customs', {
        title: 'Custom Graphs',
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
        dateRegister: req.session,
        role: req.session.role
    });
});

module.exports = router;