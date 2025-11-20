const express = require('express');
const router = express.Router();
const userSchema = require('../validations/userValidation');const bcrypt = require('bcrypt');

const {registerUser} = require('../controllers/authController');
const {loginUser} =require('../controllers/authController');
const {logoutUser} = require('../controllers/authController');

const validate = require('../utils/validate');
const loginValidation = require('../validations/userLoginValidation'); //schema
const userModel = require('../models/user-model');
const productModel = require('../models/product-model');
const orderModel = require('../models/order-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), registerUser);

//now create login side of things
router.post('/login', validate(loginValidation), loginUser);

router.get('/logout', logoutUser);


router.get('/placeOrder', isLoggedIn, function(req,res){
  res.redirect('/cart');
})
router.post('/placeOrder',isLoggedIn,async function(req,res){
  let user = req.user;
  if(!user.cart || user.cart.length === 0){
    req.flash("error", "Cart DNE");
    res.redirect('/cart');
  }
  // 1.	Loop through each item in cart
  // 2.	Find each product from DB
  // 3.	Create snapshots
  // 4.	Add to orderItems[]
  // 5.	Calculate totals
  // 6.	Create Order
  // 7.	Clear user cart
  // 8.	Redirect to order page
  try{
    const orderItems = await Promise.all(
    user.cart.map(async(cartItem)=>{
        const prod = await productModel.findById(cartItem.product);
        if(!prod){
          req.flash("error", "One of the products no longer exists");
        }
        return{
          productId: prod._id,
          name : prod.name,
          priceAtPurchase : prod.price,
          quantity : cartItem.quantity,
          image : prod.image,
          subtotal : prod.price * prod.quantity
        };
      })
    );
    //calculate totals 
    const itemTotal = orderItems.reduce((sum,item)=>sum + item.subtotal, 0 );
    const tax = 0;
    const shippingCharges = 0;
    const finalAmount = itemTotal + tax + shippingCharges;

    //create the order
    const newOrder = await orderModel.create({
      userId: user._id,
      items : orderItems,
      itemTotal,
      tax,
      shippingCharges,
      finalAmount,
      orderStatus,
      paymentStaus
    });

    //clear teh cart
    user.cart = [];
    await user.save();

  }catch(err){
    req.flash("error", "Something went wrong while placing teh order");
    return res.redirect('/cart');
  }
})

module.exports = router;