const mongoose = require('mongoose');
const connectdb = mongoose
.connect("mongodb://localhost:27017/scratch")
.then(function(){
    console.log("connected");
})
.catch(function(err){
    console.log(err);
})

module.exports =connectdb;