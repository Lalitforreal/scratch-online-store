const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    image : Buffer, //used buffer instead of string cause multer provides images as buffer
    name : String,
    price : Number,
    discount :{
        type : Number,
         default: 0
    },

    bgcolor : String,
    panelcolor : String,
    quantity : {
        type : Number,
        default : 0
    },
    textcolor : String,
    stock : Number
})

module.exports = mongoose.model("product", productSchema);

