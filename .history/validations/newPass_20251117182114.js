//joi validation 
const Joi = require('joi');

const userSchema = Joi.object({
    password: Joi.string().min(6).required(),
});

module.exports = userSchema;