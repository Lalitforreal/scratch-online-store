const jwt = require('jsonwebtoken');

const generateToken = (user)=>{
    return jwt.sign({email : user.email, id: user._id, role: user.role}, process.env.JWT_KEY);
};

module.exports.generateToken = generateToken; //basically exporting an object with generateToken as key and the function as value
//now require it whereever you need firstly in teh userRouter