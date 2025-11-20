const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    let {image, name, price, discount, bgcolor,panelcolor, textcolor} = req.body;
    try{
    const product = productModel.create({
            image : req.file.Buffer, //used buffer instead of string cause multer provides images as buffer
            name : name,
            price : price,
            discount : Number(discount),
            bgcolor,
            panelcolor ,
            textcolor 
    });
    }catch{
        res.send("Nope");
    }
    res.send(product);
})

module.exports = router;