var controller = require('express').Router();
var runs = require('../models/run.js');

controller.get('/', function(req, res){
	res.send('oh hai!');
})

module.exports = controller;
