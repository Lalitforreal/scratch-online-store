const express = require('express');
const router = express.Router();

const ownerModel = require('../models/owner-model');
const ownerSchema = require('../validations/ownerValidation'); //joi schema
const validate = require('../utils/validate'); //joi middleware

router.get('/', function(req,res){
    res.send("hey owner's route is working"); 
})

// console.log(process.env. NODE_ENV); to check the env

if(process.env.NODE_ENV === "development"){
    router.post('/create', validate(ownerSchema), async function(req,res){
        //now check if there already exists an owner cause only 1 allowed.
        let owner = await find();
        if(owner.length > 0){
            return res
            .send(503)
            .send("You don't have permission to create a new owner");
        }
        //now create the owner
        try{
            const newOwner = await ownerModel.create(req.body)''
            res.send({message :"Registered successfully : " ,owner:newOwner.toObject()});
        }catch{
            res.status(400).json({ error: err.message });
        }
    })
}

module.exports = router;