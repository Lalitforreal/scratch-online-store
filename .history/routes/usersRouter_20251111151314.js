const express = require('express');
const router = express.Router();

app.get('/', function(req,res){
    res.render("index");
})


module.exports = router;