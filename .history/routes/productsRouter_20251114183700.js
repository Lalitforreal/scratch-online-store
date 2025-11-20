const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    let {image, name, price, discount, bgcolor,panelcolor, textcolor} = req.body;
    try{
    let product = productModel.create({
            image : req.file.Buffer, //used buffer instead of string cause multer provides images as buffer
            name : name,
            price : price,
            discount :{
                type : discount,
                default: 0
            },
            bgcolor,
            panelcolor ,
            textcolor 
    })
    }catch{

    }
    res.send("hehe");
})

module.exports = router;