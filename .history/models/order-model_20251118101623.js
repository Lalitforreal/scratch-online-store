const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    productid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    }


})