const express = require('express');
const router = express.Router();

const Owner = require('../models/owner-model');
const ownerSchema = require('../validations/ownerValidation');
const validate = require('../utils/validate')



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