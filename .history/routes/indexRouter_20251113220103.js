const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('index', { error, success });
});

router.get('/shop', isLoggedIn, function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('shop', { error, success });
});
router.get('/logout', function(req,res){
    res.cookie("token", "");
    res.redirect('/');
})

module.exports = router;