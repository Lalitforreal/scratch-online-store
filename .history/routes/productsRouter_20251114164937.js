const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    try{
    image : Buffer, //used buffer instead of string cause multer provides images as buffer
    name : String,
    price : Number,
    discount :{
        type : Number,
         default: 0
    },

    bgcolor : String,
    panelcolor : String,
    textcolor : String
}
    }catch{

    }
    res.send("hehe");
})

module.exports = router;