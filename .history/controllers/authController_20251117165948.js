//JOI
const userModel = require('../models/user-model');
const {generateToken} = require('../utils/generateToken');
const bcrypt= require('bcrypt');
const crypto = require('crypto'); // forgot password usage


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

// Generate raw token
// Hash token to store in DB
// Save to DB with expiry
// Create link

module.exports.forgotPass = async function(req,res){
    const {email} = req.body;
    let user = await userModel({ email : req.body.email});

    if(!user){
        req.flash("info", "Password reset link sent if email exists.");
        return res.redirect('/');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash("sha256").update(resetToken);

    //save to DB with expiry 
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10 min

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    //use node mailer instead of logging
    console.log("Sent email : ", resetURL);

    req.flash("success", "Password reset link has been sent to " + email);
    res.redirect('/');
}

module.exports.logoutUser = function(req,res){
    res.cookie("token", "");
    res.redirect('/');
}

