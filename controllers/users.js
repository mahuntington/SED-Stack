var controller = require('express').Router(); //require express and create a router (controller)
var bodyParser = require('body-parser'); //body parser takes form data and attaches it to req object
var bcrypt = require('bcrypt'); //require bcrypt for salting passwords
var Users = require('../models/users.js'); //require our Users model

controller.use(bodyParser.urlencoded({ extended: false })) //tell body parser that we'll be passing in form data

controller.get('/new', function(req, res){ //route for showing form for creating a new user
	res.render('users/new.ejs'); //render /views/users/new.ejs
});

controller.post('/', function(req, res){ //handles creation of new user
	req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); //change req.body.password be the an encrypted version of itself
	Users.create(req.body).then(function(createdUser){ //create a new user with data from req.body
		res.redirect('/'); //redirec to home
	});
});

module.exports = controller;
