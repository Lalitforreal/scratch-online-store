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
const isLoggedIn = require('../middlewares/isLoggedIn');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), registerUser);

//now create login side of things
router.post('/login', validate(loginValidation), loginUser);

router.get('/logout', logoutUser);

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
  if(user.cart.length >0){
      const orderItems = await Promise.all(user.cart.map(async (cardItem)=>{
      const prod = await productModel.findById(cartItem.product);
      if(!product){
        req.flash("error", "Product not found");
        res.redirect('/cart');
      }


    
    }));
  }
})

module.exports = router;