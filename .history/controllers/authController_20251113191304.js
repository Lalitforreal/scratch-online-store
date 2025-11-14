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
                    return res
                    .status(403)
                    .send("User already exists, Not allowed");
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
                res.send({message :"User Registered successfully : " ,user:newUser.toObject()});
            }catch{
                res.status(400).json({ error: err.message });
            }
        });
    });
}

module.exports.loginUser =async function(req,res){
    let {email, password} = req.body;
    let user = await userModel.findOne({email : email});
    if(!user){
        return res.status(404).send("email or password incorrect");
    }

    bcrypt.compare(password , user.password, function(err,result){
        res.send(result)
    ˀ} )


}