//joi validation 
const Joi = require('joi');

const ownerSchema = Joi.object({
    fullname: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role : Joi.string().required(),
    gstin: Joi.string().optional(),
    picture: Joi.string().optional(),
    products: Joi.array().optional()
});

module.exports = ownerSchema;