const express = require('express');
const router = express.Router();

//JOI
const userModel = require('../models/user-model');
const userSchema = require('../validations/userValidation');
const validate = require('../utils/validate');

router.get('/', function(req,res){
    res.render("index");
})

router.post('/register',validate(userSchema), async function(req,res){
    let {fullname, email, password} = req.body;
    //here add joi
    let user = await userModel.findOne({email : req.body.email});
    if(!user){
            return res
            .send(403)
            .send("User already exists, Not allowed");
    }

    try{
        const newUser = await userModel.create(req.body);
        res.send({message :"User Registered successfully : " ,user:newUser.toObject()});

    }


})

module.exports = router;