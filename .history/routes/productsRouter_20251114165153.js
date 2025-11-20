const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    try{
    let product = productModel.create({
            image : req.file.Buffer, //used buffer instead of string cause multer provides images as buffer
            name : req.name,
            price : req.price,
            discount :{
                type : req.discount,
                default: 0
            },
            bgcolor : String,
            panelcolor : String,
            textcolor : String
    })
    }catch{

    }
    res.send("hehe");
})

module.exports = router;