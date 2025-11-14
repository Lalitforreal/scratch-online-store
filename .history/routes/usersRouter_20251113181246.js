const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//JOI
const userModel = require('../models/user-model');
const userSchema = require('../validations/userValidation');
const validate = require('../utils/validate');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), function(req,res){
    let {fullname, email, password} = req.body;
    //here we have to use bcrypt for password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            //here add joi
            let user = await userModel.findOne({email});
            // if(user){
            //         return res
            //         .status(403)
            //         .send("User already exists, Not allowed");
            // }
            try{
                const newUser = await userModel.create({
                    fullname,
                    email,
                    password : hash
                });
                //use jwt to create a token so that the cookie has details of the user while creating isLogged in and stuff
                let token = jwt.sign({email,id: user._id}, "secretKey");

                
                console.log(password);
                res.send({message :"User Registered successfully : " ,user:newUser.toObject()});
            }catch{
                res.status(400).json({ error: err.message });
            }
        });
    });
})

module.exports = router;