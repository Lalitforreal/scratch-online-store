
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body); //Joi method that checks and matches teh rules
    if (error){
        req.flash("error", error.details[0].message);
        return res.redirect('/');
    }
        
    req.body = value; // replace with validated data
    next(); // proceed to route handler
};

module.exports = validate;