const express = require('express');
const router = express.Router();

//JOI
const userModel = require('../models/user-model');
const userSchema = require('../validations/userValidation');
const validate = require('../utils/validate');
// console.log("User model:", userModel); here the model didn;t import properly 

router.get('/users', function(req, res) {
  res.render("index");
});


router.post('/register',validate(userSchema), async function(req,res){
    let {fullname, email, password} = req.body;
    //here add joi
    let user = await userModel.findOne({email});
    if(user){
            return res
            .status(403)
            .send("User already exists, Not allowed");
    }

    try{
        const newUser = await userModel.create(req.body);
        res.send({message :"User Registered successfully : " ,user:newUser.toObject()});
    }catch{
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;