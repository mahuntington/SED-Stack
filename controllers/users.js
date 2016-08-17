var controller = require('express').Router();
var bodyParser = require('body-parser');

controller.use(bodyParser.urlencoded({ extended: false }))

controller.get('/new', function(req, res){
	res.render('users/new.ejs');
});

controller.post('/', function(req, res){
	res.send(req.body);
});

module.exports = controller;
