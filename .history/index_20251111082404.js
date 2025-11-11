const express = require('express');
const app = express();
const path = require('path');
const cookieParser = requrie('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', "ejs");

app.get('/', (req,res)=>{
    res.send("hey");
})

app.listen(3000);