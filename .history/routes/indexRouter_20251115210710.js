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
    // Check if product already in cart
    let item = user.cart.find( //loops through every item in user.cart
        i => i.product.toString() === req.params.productid
    );

    if(item){
        item.quantity += 1;
        await user.save();
        req.flash("success", "Increased quantity");
        return res.redirect('/shop');
    }

    // If not present, add new entry
    user.cart.push({
        product: req.params.productid,
        quantity: 1
    });
    //now show teh quantity in /cart page
    await user.save();
    req.flash("success", "Added to cart");
    // console.log(product); debug step
    res.redirect('/shop');
});

router.get('/cart',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email}).populate('cart.product');//if you dont populate cart image 
    //will just be obj id not actual buffer
    let products = user.cart; // contains [{product, quantity}]
    let success = req.flash('success');
    // console.log(success);
    res.render("cart", {products, success});
});
router.post('/add/:id', function(req,res){

})

router.get('/remove/:productid', isLoggedIn, async function (req,res) {
    // to remove the product from the user cart array we have 3 wasy but the best way is $pull  it works even fi teh product appears many time in teh array 
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productid);
    //filter() loops through the whole cart and keeps only the items that match the condition.
    await user.save();

    req.flash("success", "Removed from cart");
    res.redirect("/cart");
});


router.get('/removeProduct/:productid',async function(req,res){
    let removedProduct = await productModel.findOneAndDelete({_id : req.params.productid});
    
    // console.log(removedProduct);
    req.flash("success", "Product removed successfully");
    res.redirect('/owners/allproducts');
})

router.get('/incquantity/:productid',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email});
    // find item in cart
    let item = user.cart.find(i => i.product.toString() === req.params.productid);
    if (item) {
        item.quantity += 1;
        await user.save();
    }
    res.redirect("/cart");
})

router.get('/decquantity/:productid',isLoggedIn, async function(req,res){

    let user = await userModel.findOne({email : req.user.email});
    let item = user.cart.find(i => i.product.toString() === req.params.productid);
    let quantity = item.quantity;
    
    //to find a product in user -> cart array which has quantity insid eit 
    let item1 = user.cart.find(i => 
        i.product.toString() === req.params.productid
    );
    console.log(req.params.productid);
    if(quantity === 1){
        res.redirect('/remove/' + req.params.productid);
    }
    if (item) {
        item.quantity -= 1;
        await user.save();
    }
    // find item in cart

    res.redirect("/cart");
})




module.exports = router;