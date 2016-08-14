var controller = require('express').Router();
var runs = require('../models/run.js');

controller.get('/', function(req, res){
	res.json(runs);
});

controller.post('/', function(req, res){
	runs.push(req.body);
	res.json(runs);
});

module.exports = controller;
