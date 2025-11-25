const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');
const { error } = require('../validations/ownerValidation');

router.post('/create',upload.single("image"), async function(req,res){
    let {image, name, price, discount, bgcolor,panelcolor, textcolor, stock} = req.body;
    try{
    const product = await productModel.create({
            image : req.file.buffer, //used buffer instead of string cause multer provides images as buffer
            name : name,
            price : price,
            discount : Number(discount),
            bgcolor,
            panelcolor ,
            textcolor,
            stock
        });
        res.redirect("/owners/allproducts");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
})



module.exports = router;