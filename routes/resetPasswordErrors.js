var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {

    res.render('resetPasswordErrors', {
        title: 'Error',
        error: '',
        token: ''
    });
});

module.exports = router;