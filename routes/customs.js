var express = require('express');
const session = require("express-session");
var router = express.Router();
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
        username: req.session.username
    });
});

module.exports = router;