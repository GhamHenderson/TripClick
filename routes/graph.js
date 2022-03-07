var express = require('express');
const session = require("express-session");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('graph', {
        title: 'Graph',
        username: req.session.username
    });
});

module.exports = router;