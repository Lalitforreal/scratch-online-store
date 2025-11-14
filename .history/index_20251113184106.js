const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

require("dotenv").config(); //this line helps you to use the env things in the config

// const userModel = require('./models/user-model');
// const productModel = require('./models/product-model');
//after seperation of concerns just import one
const db = require('./config/mongoose-connection');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', "ejs");

const ownersRouter = require('./routes/ownersRouter');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');

//this code here will send all the owners route to the
// router in the routes folder
app.use('/owners', ownersRouter);
app.use('/products', productsRouter );
app.use('/users', usersRouter);


app.listen(3000); 