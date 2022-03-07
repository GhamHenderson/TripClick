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
    // const {userId} = req.session;
    // const {username} = req.session;
    res.render('login', {
        title: 'Login',
        username: req.session.username
        // validSession: req.session.username
    });
    // console.log(username);
});

module.exports = router;