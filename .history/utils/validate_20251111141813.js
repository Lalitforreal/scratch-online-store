const validate = (schema) => (req, res, next) => {
    console.log('Received body:', req.body);
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    req.body = value; // replace with validated data
    next(); // proceed to route handler
};

module.exports = validate;