
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body); //Joi method that checks and matches teh rules
    if (error){
     return res.status(400).json({ error: error.details[0].message });
    }   
    req.body = value; // replace with validated data
    next(); // proceed to route handler
};

module.exports = validate;