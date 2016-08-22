var controller = require('express').Router(); //require express and create a router (controller)
var bcrypt = require('bcrypt'); //require bcrypt for comparing passwords
var methodOverride = require('method-override'); //method override is used for create delete and put methods on forms
var bodyParser = require('body-parser'); //body parser takes form data and attaches it to req object
var Users = require('../models/users.js'); //require our Users model

controller.use(bodyParser.urlencoded({ extended: false }));  //tell body parser that we'll be passing in form data
controller.use(methodOverride('_method')); //tell method override to expect ?method=PUT/DELETE attached to POST requests

controller.get('/new', function(req, res){ //GET request to /new show form for creating a new login session
	res.render('logins/new.ejs'); //render logins/new.ejs
});

controller.post('/', function(req, res){ //handles request to log in
	Users.findOne({ //find a user whose name is req.body.username (from form)
		where: {
			username:req.body.username
		}
	}).then(function(foundUser){ //once found
		if(bcrypt.compareSync(req.body.password, foundUser.password)){ //compare password passed in through request to what's in the DB
			req.session.currentUser = foundUser; //if they match, set the session variable
		}
		res.redirect('/'); //redirect to home
	});
});

controller.delete('/', function(req, res){ //logout route
	req.session.destroy(function(){ //destroy the session
		res.redirect('/'); //redirect to home
	});
});

module.exports = controller;
