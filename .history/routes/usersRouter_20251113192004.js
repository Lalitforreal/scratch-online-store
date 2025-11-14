const express = require('express');
const router = express.Router();
const userSchema = require('../validations/userValidation');const bcrypt = require('bcrypt');

const {registerUser} = require('../controllers/authController');
const {loginUser} =require('../controllers/authController');

const validate = require('../utils/validate');
const loginValidation = require('../validations/userLoginValidation'); //schema
const userModel = require('../models/user-model');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), registerUser);

//now create login side of things

router.post('/login', validate(loginValidation), loginUser);

module.exports = router;