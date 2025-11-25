//joi validation 
const Joi = require('joi');

const userSchema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    cart: Joi.array().optional(),
    orders: Joi.array().optional(),
    contact: Joi.number().min(10).required(),
    picture: Joi.string().optional(),
     resetPasswordToken: Joi.string().optional(),
    resetPasswordExpires: Joi.date().optional()
});

module.exports = userSchema;