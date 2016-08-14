var controller = require('express').Router();

controller.get('/', function(req, res){
	res.send('oh hai!');
})

module.exports = controller;
