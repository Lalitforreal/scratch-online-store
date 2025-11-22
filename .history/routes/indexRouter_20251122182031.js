const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const orderModel = require('../models/order-model');
const {forgotPass} = require('../controllers/authController');
const {resetPassword} = require('../controllers/authController');



router.get('/', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('index', { error, success });
});

router.get('/shop', isLoggedIn, async function(req, res) {
    //Read the selected sort option from URL (e.g., /shop?sort=price-asc)
    const sortParams = req.query.sort;

    // A mapping that converts sortParam → actual MongoDB sorting
    const sortOptions = {
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        "name-asc": { name: 1 },
        "name-desc": { name: -1 },
        "newest": { createdAt: -1 }
    };
    //If sortParam exists in sortOptions → use it
    //else use default sorting (newest first)
    const sortQuery = sortOptions[sortParams] || {createdAt:  -1}; //either options or newest first
    
    // Fetch products from database with sorting applied
    let products = await productModel.find().sort(sortQuery);
    let success = req.flash('success');
    res.render('shop', {products, success, sortParams});
});

router.get('/owners/login', function(req, res) {
    const error = req.flash('error');
    const success = req.flash('success');
    res.render('owner-login', { error, success });
}); 

//for owner
router.get('/removeProduct/:productid',async function(req,res){
    let removedProduct = await productModel.findOneAndDelete({_id : req.params.productid});
    // console.log(removedProduct);
    req.flash("success", "Product removed successfully");
    res.redirect('/owners/allproducts');
})

router.get('/cart',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email}).populate('cart.product');//if you dont populate cart image 
    //will just be obj id not actual buffer
    let products = user.cart; // contains [{product, quantity}]
    let success = req.flash('success');
    // console.log(success);
    res.render("cart", {products, success});
});

router.get('/addtocart/:productid',isLoggedIn, async function(req,res){
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


router.get('/remove/:productid', isLoggedIn, async function (req,res) {
    // to remove the product from the user cart array we have 3 wasy but the best way is $pull  it works even fi teh product appears many time in teh array 
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(i => i.product.toString() !== req.params.productid);
    //filter() loops through the whole cart and keeps only the items that match the condition.
    await user.save();
    req.flash("success", "Removed from cart");
    res.redirect("/cart");
});


router.get('/incquantity/:productid',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email});
    // find item in cart
    let item = user.cart.find(i => i.product.toString() === req.params.productid);
    if (item) {
        item.quantity += 1;
        await user.save();
    }
    req.flash("success", "Increased Quantity");
    res.redirect("/cart");
})

router.get('/decquantity/:productid',isLoggedIn, async function(req,res){
    let user = await userModel.findOne({email : req.user.email});
    // find item in cart
    let item = user.cart.find(i => i.product.toString() === req.params.productid);
    let quantity = item.quantity;
    // console.log(req.params.productid);
    if(quantity === 1){
        res.redirect('/remove/' + req.params.productid);
    }
    if (item) {
        item.quantity -= 1;
        await user.save();
    }
    req.flash("success", "Decreased Quantity");
    res.redirect("/cart");
})


router.get('/forgotPass', function(req,res){
    res.render("forgotpass");
})
router.post('/forgotPass' , forgotPass ); //controller


const validate = require('../utils/validate');
const newPass = require('../validations/newPass');


router.get('/reset-password/:tokenid', function(req,res){
    const token = req.params.tokenid;
    console.log(token);
    res.render('reset-password', {token});
})

router.post('/reset-password/:tokenid', resetPassword);


router.get("/order-summary", isLoggedIn, async function(req, res) {
    let user = await userModel.findById(req.user._id).populate("cart.product");

    if (!user.cart.length) {
        req.flash("error", "Your cart is empty");
        return res.redirect("/cart");
    }

    const orderItems = user.cart.map(item => {
        return {
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,  // buffer
            subtotal: item.product.price * item.quantity
        }
    });

    const itemTotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0);

    res.render("order-summary", {
        orderItems,
        itemTotal,
        tax: 0,
        shippingCharges: 0,
        finalAmount: itemTotal
    });
});

// 1. Loop through each item in cart
// 2. Find each product from DB
// 3. Create snapshots
// 4. Add to orderItems[]
// 5. Calculate totals
// 6. Create Order
// 7. Clear user cart
// 8. Redirect to order page
router.post('/create-order',isLoggedIn,async function(req,res){
//   console.log(" POST /placeOrder HIT");
//   let user = req.user; this will not contain teh updated cart so do this instead
    let user = await userModel.findOne({_id : req.user._id});
    // console.log(user.cart);
  if(!user.cart || user.cart.length === 0){
    req.flash("error", "Cart DNE");
    return res.redirect('/cart');
  }
  try{
    //   console.log("try started"); 
    //  Promise.all() takes an array of Promises and waits until ALL of them finish.
    const orderItems = await Promise.all(
    user.cart.map(async(cartItem)=>{ //here is teh looping inside the promise all
        const prod = await productModel.findById(cartItem.product);
        // console.log(prod);
        if(!prod){
            console.log("Product not found:", cartItem.product);
            throw new Error("Product missing");
        }
        // console.log(cartItem.quantity);
        return{
          productId: prod._id,
          name : prod.name,
          priceAtPurchase : prod.price,
          quantity : cartItem.quantity,
          image : prod.image,
          subtotal : prod.price * cartItem.quantity
        };
      })
      
    );
    //calculate totals 
    const itemTotal = orderItems.reduce((sum,item)=>sum + item.subtotal, 0 );
    const tax = 0;
    const shippingCharges = 0;
    const finalAmount = itemTotal + tax + shippingCharges;
    // console.log(itemTotal)

    // create the order
    const newOrder = await orderModel.create({
      userid: user._id,
      items : orderItems,
      itemsTotal : itemTotal,
      orderStatus : "pending",
      paymentStatus : "pending",
      finalAmount : finalAmount
    });
    // console.log(newOrder);
    //clear teh cart
    user.cart = [];
    await user.save();
    req.flash("success", "Order placed successfully!");
    return res.redirect(`/order/${newOrder._id}`);

  }catch(err){
    req.flash("error", "Something went wrong while placing teh order");
    return res.redirect('/cart');
  }
})
//make the razorpay portal from here onˀ
router.get('/order/:orderid', function(req,res){
    res.send("razorpay portal");
})

router.get('/address',isLoggedIn, function(req,res){
    res.render("add-address");
})

router.post('/add-address',isLoggedIn, async function(req,res){
    let {fullName,phone,pincode,line1,line2,city,state} = req.body;

    let user = await userModel.findOne({_id : req.user._id});
    console.log(user);
})

module.exports = router;