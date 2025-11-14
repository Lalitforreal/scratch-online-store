const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
    res.send("hey owner's route is working"); 
})

// console.log(process.env. NODE_ENV); to check the env

router.post('/create', function(req,res){
    res.send("createdd");
})

module.exports = router;