const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

require("dotenv").config(); //this line helps you to use the env things in the config

// const userModel = require('./models/user-model');
// const productModel = require('./models/product-model');
//after seperation of concerns just import one
const db = require('./config/mongoose-connection');
const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

//now comes the code written after middleware 
const flash = require('connect-flash')
const expressSession = require('express-session');

app.use(
    expressSession({
        resave : false,
        saveUninitialized : false,
        secret : process.env.EXPRESS_SESSION_SECRET
    })
)
app.use(flash()); //set up flash with pre-req being expressSessio

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', "ejs");


//this code here will send all the owners route to the
// router in the routes folder
app.use('/', index)
app.use('/owners', ownersRouter);
app.use('/products', productsRouter );
app.use('/users', usersRouter);


app.listen(3000); 