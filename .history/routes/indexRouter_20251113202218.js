const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', function(req,res){
    res.render("index")
});

router.get('/shop', isLoggedIn, function(req,res){
    res.render("shop");
});
module.exports = router;