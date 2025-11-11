const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/scratch");

//schema similar to userModel
const userSchema = mongoose.Schema({
     fullname : {
        type : String,
        minLength : 3,
        trim : true
     },
     email : String,
     password : String,
     // No cart case owener is teh one selling
     products : {
        type : Array,
        default : []
     },
     gstin : String,
     picture : String
})

module.exports = mongoose.model("user", userSchema);