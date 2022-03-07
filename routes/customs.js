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

/* GET home page. */
router.get('/', redirectLogin, function (req, res, next) {

    // if(!req.session.username){
    //     req.session.username = false;
    // }
    res.render('customs', {
        title: 'Custom Graphs',
        username: req.session.username
        // validSession: req.session.username
    });
});

module.exports = router;