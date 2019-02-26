var express = require('express');
var app = express()
//var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
app.get('/', function(req, res) {  
  // render to views/index.ejs template file
  res.render('index', { title: 'Aplikasi Toko Buku' });
});

module.exports = app;
