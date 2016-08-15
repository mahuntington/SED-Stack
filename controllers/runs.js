var controller = require('express').Router();
var Runs = require('../models/run.js');

controller.get('/', function(req, res){
	Runs.findAll().then(function(data){
		res.json(data);
	});
});

controller.post('/', function(req, res){
	Runs.create({
		date: new Date(1980, 6, 20),
		distance: 15.5
	}).then(function(createdRun){
		res.json(createdRun);
	});;
});

controller.delete('/:id', function(req, res){
	Runs.destroy({
		where: {
			id: req.params.id
		}
	}).then(function(didSucceed){
		res.json(didSucceed);
	});
});

module.exports = controller;
