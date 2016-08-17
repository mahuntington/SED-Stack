var controller = require('express').Router();
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var Users = require('../models/users.js');

controller.use(bodyParser.urlencoded({ extended: false }))

controller.get('/new', function(req, res){
	res.render('logins/new.ejs');
});

controller.post('/', function(req, res){
	Users.findOne({
		where: {
			username:req.body.username
		}
	}).then(function(foundUser){
		if(bcrypt.compareSync(req.body.password, foundUser.password)){
			req.session.currentUser = foundUser;
		}
		res.redirect('/');
	});
});

module.exports = controller;
