//JOI
const userModel = require('../models/user-model');
const {generateToken} = require('../utils/generateToken');
const bcrypt= require('bcrypt');
const crypto = require('crypto'); // forgot password usage
const nodemailer = require('nodemailer'); //forgot password



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

// Hash token to store in DB
// Save to DB with expiry
// Create link

//before using nodemailer see the idp given by nodemaile 
// async function createAccount(){
    //   let testAccount = await nodemailer.createTestAccount();
    //   console.log(testAccount);
    // }
    // createAccount();
    
    module.exports.forgotPass = async function(req,res){
        const {email} = req.body;
        let user = await userModel.findOne({ email : req.body.email});
        
        if(!user){
            req.flash("info", "Password reset link sent if email exists.");
            return res.redirect('/');
        }
        
     // Generate raw token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    console.log(hashed);
    //without this digest it stores a hashed object not a string
    // console.log("User found:", user);
    //save to DB with expiry 
    user.resetPasswordToken = hashed;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //10 min

    await user.save().then(() => {
        console.log("User saved to DB");
        }).catch(err => {
        console.log("SAVE ERROR:", err);
        });

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    //you'll get teh unhashed token in mail url but wehn you do the reset-pass route below you hash it agai8n with the same pass of create hash
    //use node mailer instead of logging
    // console.log("Sent email : ", resetUrl);
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "furryheartshaven@gmail.com",
        pass: process.env.GMAIL_PASS
    },
    });

    // Wrap in an async IIFE so we can use await.
    const info = await transporter.sendMail({
    from: '"The Scratch Team" <furryheartshaven@gmail.com>',
    to: email,
    subject: "Reset Your Password",
    html: `
        <p>Hello ${user.fullname},</p>
        <p>Click below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
    `,
    });
    console.log("Message sent:", info.messageId);
    console.log("Preview:", nodemailer.getTestMessageUrl(info));

    req.flash("success", "Password reset link has been sent to " + email);
    res.redirect('/');
}

//now after you get the reset link in your mail
module.exports.resetPassword = async function(req,res){
    const rawToken = req.params.tokenid;
    const {password} = req.body;
    console.log(rawToken);

    //add teh same key as creating the token in forgort pass so the hashed is same
    const hashed = crypto.createHash("sha256").update(rawToken).digest("hex");
    const user =await userModel.findOne({
        resetPasswordToken : hashed,
        resetPasswordExpires : { $gt: Date.now() } // Not expired
    })

    if (!user) {
        req.flash("error", "Token invalid or expired");
        return res.redirect("/");
    }

    //now create new pass
    const salt = await bcrypt.genSalt(50);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    req.flash("success", "Password successfully reset");
    res.redirect("/");

}

module.exports.logoutUser = function(req,res){
    res.cookie("token", "");
    res.redirect('/');
}

