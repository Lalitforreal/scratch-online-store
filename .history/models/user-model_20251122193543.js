const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
     fullname : {
        type : String,
        minLength : 3,
        trim : true
     },
     email : String,
     password : String,
      cart: [
      {
         product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
         },
         quantity: {
            type: Number,
            default: 1
         }
      }],
     orders : {
        type : Array,
        default : []
     },
     address: [{
         fullName: String,
         phone: Number,
         pincode: Number,
         line1: String,
         line2: String,
         city: String,
         state: String
      }], 
     contact : Number,
     picture : String,
     resetPasswordToken: String,
      resetPasswordExpires: Date
})

module.exports = mongoose.model("user", userSchema);