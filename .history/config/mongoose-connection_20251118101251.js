const mongoose = require('mongoose');
//FOR url in config
const config = require('config');

const dbgr = require('debug')('development:mongoose');

const connectdb = mongoose
.connect(`${config.get("MONGODB_URI")}/scratch`)
.then(function(){
    dbgr("connected");
})
.catch(function(err){
    dbgr(err);
})

module.exports =connectdb;