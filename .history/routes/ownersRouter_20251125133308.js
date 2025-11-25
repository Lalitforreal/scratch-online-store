const express = require('express');
const router = express.Router();

const ownerModel = require('../models/owner-model');
const ownerSchema = require('../validations/ownerValidation'); //joi schema
const validate = require('../utils/validate'); //joi middleware
const ownerLoginSchema = require('../validations/userLoginValidation');
const { func } = require('joi');
const productModel = require('../models/product-model');
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAdmin = require('../middlewares/isAdmin');
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");


router.get('/login', function(req,res){

    res.render("owner-login");
})

router.post('/login', validate(ownerLoginSchema),async function(req,res){
    const {email, password} = req.body;
    try{
    const owner = await ownerModel.findOne({email : email});
    if(!owner){
        req.flash('error', 'Email or password incorrect');
        return res.redirect('/owners/login');
    }
    console.log(password, owner.password);

    const isMatch = await bcrypt.compare(password, owner.password);
    console.log("Login attempt:", { email, isMatch });

    if (!isMatch) {
      req.flash('error', 'Email or password incorrect');
      return res.redirect('/owners/login');
    }
        const token = generateToken(owner);
        res.cookie('token', token);
        req.flash('success', 'You have successfully logged in');
        return res.redirect('/owners/admin');
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/owners/login');
    }
});

// console.log(process.env. NODE_ENV); to check the env
if(process.env.NODE_ENV === "development"){
    router.post('/create', validate(ownerSchema), async function(req,res){
        //now check if there already exists an owner cause only 1 allowed.
        let owner = await ownerModel.find();
        if(owner.length > 0){
            return res
            .send(503)
            .send("You don't have permission to create a new owner");
        }
        //now create the owner
        try{
            const newOwner = await ownerModel.create(req.body);
            res.send({message :"Registered successfully : " ,owner:newOwner.toObject()});
        }catch(err){
            res.status(400).json({ error: err.message });
        }
    })
}

router.get("/admin",isAdmin,isLoggedIn, function(req,res){
    let success = req.flash('success',"product added");
    res.render("createproducts", {success});
})

router.post('/admin', function(req,res){
    const success = req.flash('success', "product added");
    res.render("createproducts", { success });
})

router.get("/allproducts",isLoggedIn,isAdmin,async function(req,res){
    const success = req.flash("success");
    let products = await productModel.find();
    res.render("editproduct", {products,success});
});

module.exports = router;