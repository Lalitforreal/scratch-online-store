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
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), registerUser);

//now create login side of things
router.post('/login', validate(loginValidation), loginUser);

router.get('/logout', logoutUser);

router.get('/cart/add/:id', async function(req,res){
    let product = await productModel.findOne({id : req.params._id});
    console.log(product);
    res.render("cart", {product});
})

router.post('/cart/add/:id', function(req,res){

})

module.exports = router;