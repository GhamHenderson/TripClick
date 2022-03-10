var express = require('express');
const session = require("express-session");
var router = express.Router();

// const redirectHome = (req, res, next) => {
//     if (!req.session.username) {
//         res.redirect('/')
//     } else {
//         next()
//     }
// }

router.get('/', function (req, res, next) {

    res.render('login', {
        title: 'Login',
        username: req.session.username,
        // firstname: req.session.firstname
    });
});

module.exports = router;