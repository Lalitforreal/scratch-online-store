const mongoose = require('mongoose');

//schema similar to userModel
const ownerSchema = mongoose.Schema({
     fullname : {
        type : String,
        minLength : 3,
        trim : true
     },
      role: {
         type: String,
         enum: ["user", "admin", "owner"],   // roles in your system
         default: "owner"
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

module.exports = mongoose.model("Owner", ownerSchema);