var express = require('express');
const session = require("express-session");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('userInfo', {
        title: 'Personal Profile',
        username: req.session.username

    });
});

module.exports = router;