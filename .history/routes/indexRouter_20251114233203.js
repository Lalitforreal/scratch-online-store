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
    const success = req.flash('success');
    res.render('shop', {products});
});

router.get('/owners/login', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('owner-login', { error, success });
});

router.get('/addtocart/:id', async function(req,res){
    let product = await productModel.findOne({id : req.params._id});
    // console.log(product); debug step
    res.render("cart", {product});
})

router.post('/add/:id', function(req,res){

})

module.exports = router;