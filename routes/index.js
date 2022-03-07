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

    // console.log(req.session);
    //
    // if(!req.session.username){
    //     req.session.username = false;
    // }
    // const username = req.session.username;
    res.render('index', {
        title: 'Homepage',
        // validSession: req.session.username
        username: req.session.username
    });
});

module.exports = router;
