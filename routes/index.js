var express = require('express');
const session = require("express-session");
var router = express.Router();

// const redirectLogin = (req, res, next) => {
//     if (!req.session.username) {
//         res.redirect('/login')
//     } else {
//         next()
//     }
// }

/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index', {
        title: 'Homepage',
        username: req.session.username,
        // firstname: req.firstname
    });
});

module.exports = router;
