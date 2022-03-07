var express = require('express');
const session = require("express-session");
var router = express.Router();
const redirectHome = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/')
    } else {
        next()
    }
}
/* GET home page. */
router.get('/', function (req, res, next) {
    //
    // if(!req.session.username){
    //     req.session.username = false;
    // }
    res.render('register', {
        title: 'Register',
        // validSession: req.session.username,
        username: req.session.username

    });
});

module.exports = router;