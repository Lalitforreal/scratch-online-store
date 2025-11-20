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

router.post('/placeOrder',isLoggedIn, function(req,res){
  let user = req.user;
  console.log(user);
})

module.exports = router;