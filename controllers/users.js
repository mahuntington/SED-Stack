var controller = require('express').Router();
var bodyParser = require('body-parser');
var Users = require('../models/users.js');

controller.use(bodyParser.urlencoded({ extended: false }))

controller.get('/new', function(req, res){
	res.render('users/new.ejs');
});

controller.post('/', function(req, res){
	Users.create(req.body).then(function(createdUser){
		res.json(createdUser);
	});;
});

module.exports = controller;
