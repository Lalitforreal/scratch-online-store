const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');


router.get('/', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('index', { error, success });
});

router.get('/users/shop', isLoggedIn, function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('shop', { error, success });
});

router.get('/owners/admin')

module.exports = router;