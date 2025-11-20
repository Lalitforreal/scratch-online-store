const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');


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

router.get('/addtocart/:productid',isLoggedIn, async function(req,res){
    //now update the user cart to have the id's of the products so that you can access those in the cart
    let user = await userModel.findOne({})
    // console.log(product); debug step
    res.render("cart", {product});
});

router.post('/add/:id', function(req,res){

})

module.exports = router;