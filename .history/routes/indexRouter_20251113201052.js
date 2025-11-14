const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');

router.get('/', function(req,res){
    let error = req.flash(error);//the prev error shown in teh middleware will beshown here because of flash in teh next window 
    res.render("index", {error})
});

router.get('/shop', isLoggedIn, function(req,res){
    res.render("shop");
});