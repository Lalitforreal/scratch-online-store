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
    let success = req.flash('success');
    res.render('shop', {products, success});
});

router.get('/owners/login', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('owner-login', { error, success });
});

router.get('/addtocart/:productid',isLoggedIn, async function(req,res){
    //now update the user cart to have the id's of the products so that you can access those in the cart
    let user = await userModel.findOne({email : req.user.email});
    console.log(req.params.productid);
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    // console.log(product); debug step
    res.redirect('/shop');
});

router.get('/cart',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email}).populate('cart');//if you dont populate cart image 
    //will just be obj id not actual buffer
    let products = user.cart;
    let success = req.flash('success');
    console.log(success);
    res.render("cart", {products, success});
})
router.post('/add/:id', function(req,res){

})

router.get('/remove/:productid', isLoggedIn, async function (req,res) {

    // to remove the product from the user cart array we have 3 wasy but the best way is $pull  it works even fi teh product appears many time in teh array 
    await userModel.updateOne({
        email : req.user.email},{$pull : {cart : req.params.productid}});
        req.flash("success" , "Removed from cart");
        res.redirect('/cart');
})


router.get('/removeProduct/:productid',async function(req,res){
    let removedProduct = await productModel.findOneAndDelete({_id : req.params.productid});
    // console.log(removedProduct);
    req.flash("success", "Product removed successfully");
    res.redirect('/owners/allproducts');
})

router.get('/quantity/:productid',async function(req,res){
    let product = await productModel.findOne({_id : req.params.productid});
    product.quantity+=1;
    console.log(product.quantity);
    res.redirect("/cart");
})


module.exports = router;