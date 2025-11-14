const express = require('express');
const router = express.Router();

const ownerModel = require('../models/owner-model');
const ownerSchema = require('../validations/ownerValidation'); //joi schema
const validate = require('../utils/validate'); //joi middleware

router.post('/register', validate(ownerSchema) ,async function(req,res){
    try{
        const newOwner = new ownerModel(req.body);
        await newOwner.save();
        res.json({message : "Successfully registered", owner : newOwner});
    }catch{
        res.status(400).json({ error: err.message });
    }
})


router.get('/', function(req,res){
    res.send("hey owner's route is working"); 
})

// console.log(process.env. NODE_ENV); to check the env

if(process.env.NODE_ENV === "development"){
    router.post('/create', function(req,res){
        res.send("createdd");
    })
}

module.exports = router;