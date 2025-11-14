//JOI
const userModel = require('../models/user-model');
const {generateToken} = require('../utils/generateToken');
const bcrypt= require('bcrypt');

module.exports.registerUser = function(req,res){
    let {fullname, email, password} = req.body;
    //here we have to use bcrypt for password
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            //here add joi
            let user = await userModel.findOne({email});
            if(user){
                    req.flash('error', 'User already exists, not allowed');
                    return res.redirect('/');
            }
            try{
                const newUser = await userModel.create({
                    fullname,
                    email,
                    password : hash
                });
                //use jwt to create a token so that the cookie has details of the user while creating isLogged in and stuff
                // let token = jwt.sign({email,id: user._id}, "secretKey");
                //but instead of creating th etoken here create it in a util file
                let token = generateToken(newUser); //used the util
                res.cookie("token" , token);
                req.flash('success', 'User registered successfully');
                return res.redirect('/');


            }catch{
                req.flash('error', err.message);
                return res.redirect('/');            }
        });
    });
}

module.exports.loginUser =async function(req,res){
    const {email, password} = req.body;
    try{
    const user = await userModel.findOne({email : email});
    if(!user){
        req.flash('error', 'Email or password incorrect');
        return res.redirect('/');
    }
    console.log(req.body.password, user.password);

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    console.log("Login attempt:", { email, isMatch });

    if (!isMatch) {
      req.flash('error', 'Email or password incorrect');
      return res.redirect('/');
    }
        const token = generateToken(user);
        res.cookie('token', token);
        req.flash('success', 'You have successfully logged in');
        return res.redirect('/shop');
    } catch (err) {
        console.error('Login error:', err);
        req.flash('error', 'Something went wrong. Please try again.');
        return res.redirect('/');
    }
};


