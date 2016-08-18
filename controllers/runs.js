var controller = require('express').Router();
var bodyParser = require('body-parser');
var Users = require('../models/users.js');
var Runs = require('../models/run.js');

controller.use(bodyParser.json());

controller.get('/', function(req, res){
	Runs.findAll().then(function(runs){
		res.json(runs);
	});
});

controller.post('/', function(req, res){
	Users.findById(req.session.currentUser.id).then(function(user){
		Runs.create(req.body).then(function(createdRun){
			user.addRun(createdRun).then(function(){
				res.json(createdRun);
			});
		});;
	});
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
