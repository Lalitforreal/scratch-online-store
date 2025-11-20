const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },

    items : [
        {
            productid : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "product"
            },
            // Snapshot of product at time of order
            name: {
            type: String,
            required: true
            },

            priceAtPurchase: {
            type: Number,
            required: true
            },

            quantity: {
            type: Number,
            required: true,
            min: 1
            },

            image: {
            type: Buffer 
            },

            subtotal: {
            type: Number,
            required: true
            }
        }],

    //pricing summary 
    itemsTotal : {
        type : Number,
        required : true
    }
    // Order / payment status
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    paymentMethod: {
      type: String, // "razorpay", "stripe", "cod"
      default: null
    },

    transactionId: {
      type: String // Razorpay/Stripe payment ID
    }
  },

  // timestamps: createdAt, updatedAt
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);