const mongoose = require('mongoose');
const dbgr = require('debug')('development : mongoose');

const connectdb = mongoose
.connect("mongodb://localhost:27017/scratch")
.then(function(){
    dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports =connectdb;