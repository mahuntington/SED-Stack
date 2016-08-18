var controller = require('express').Router();
var bodyParser = require('body-parser');
var Runs = require('../models/run.js');

controller.use(bodyParser.json());

controller.get('/', function(req, res){
	Runs.findAll().then(function(runs){
		res.json(runs);
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
