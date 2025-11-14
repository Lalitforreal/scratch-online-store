const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports = async function(req,res,next){
    if(!req.cookies.token){
        req.flash("error", "You need to login first"); //will be flashed when redirected
        return res.redirect('/');
    }

    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel
        .findOne({email : decoded.email})
        .select("-password"); //select used to deduct the password with the data demanded from the user
        req.user = user; //now you can access teh data in parts where you use the middleware
        next();
    }catch{
        req.flash("error", "something went wrong");
        return res.redirect('/');
    }
}