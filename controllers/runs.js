var controller = require('express').Router();
var Runs = require('../models/run.js');

controller.get('/', function(req, res){
	Runs.findAll().then(function(data){
		res.json(data);
	});
});

controller.post('/', function(req, res){
	Runs.create(req.body).then(function(createdRun){
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

controller.put('/:id', function(req, res){
	Runs.update(
		req.body,
		{
			where: {
				id: req.params.id
			}
		}
	).then(function(didSucceed){
		res.json(didSucceed);
	});
});

module.exports = controller;
