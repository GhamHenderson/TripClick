var express = require('express');
const session = require("express-session");
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('graph', {
        title: 'Graph',
        username: req.session.username,
        // firstname: req.session.firstname
    });
});

module.exports = router;