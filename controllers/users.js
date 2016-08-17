var controller = require('express').Router();

controller.get('/new', function(req, res){
	res.render('users/new.ejs');
});

module.exports = controller;
