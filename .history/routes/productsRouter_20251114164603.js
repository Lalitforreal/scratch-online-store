const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.post('/create',upload.single("image"), async function(req,res){
    res.send(req.file);
})

module.exports = router;