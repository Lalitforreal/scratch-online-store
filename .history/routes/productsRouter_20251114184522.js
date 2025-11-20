const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    let {image, name, price, discount, bgcolor,panelcolor, textcolor} = req.body;
    try{
    const product = await productModel.create({
            image : req.file.buffer, //used buffer instead of string cause multer provides images as buffer
            name : name,
            price : price,
            discount : Number(discount),
            bgcolor,
            panelcolor ,
            textcolor 
        });
        res.send(product);
    }catch{
        res.send("Nope");
    }
})

module.exports = router;