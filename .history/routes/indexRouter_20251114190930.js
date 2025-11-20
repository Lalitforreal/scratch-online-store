const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');


router.get('/', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('index', { error, success });
});

router.get('/shop', isLoggedIn, async function(req, res) {
    let products = await productModel.find();
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('shop', { error, success });
});

router.get('/owners/login', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('owner-login', { error, success });
});

module.exports = router;