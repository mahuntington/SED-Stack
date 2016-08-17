var controller = require('express').Router();
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var Users = require('../models/users.js');

controller.use(bodyParser.urlencoded({ extended: false }))

controller.get('/new', function(req, res){
	res.render('users/new.ejs');
});

controller.post('/', function(req, res){
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
	Users.create(req.body).then(function(createdUser){
		res.redirect('/');
	});
});

module.exports = controller;
