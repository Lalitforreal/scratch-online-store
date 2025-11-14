const express = require('express');
const router = express.Router();
const {registerUser} = require('../controllers/authController');

const validate = require('../utils/validate');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), registerUser);

module.exports = router;