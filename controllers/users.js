var controller = require('express').Router();

controller.get('/new', function(req, res){
	res.send('users!');
});

module.exports = controller;
