var controller = require('express').Router(); //require express and create a router (controller)
var bodyParser = require('body-parser'); //body parser takes form data and attaches it to req object
var Users = require('../models/users.js'); //require our Users model
var Runs = require('../models/run.js'); //require our Runs model

controller.use(bodyParser.json()); //anything handled by this controller is expecting JSON data, not form data

controller.get('/', function(req, res){ //route for finding all routes by a the session user
	Users.findById(req.session.currentUser.id).then(function(user){ //find the user in the DB who's ID matches that of the session users
		user.getRuns().then(function(runs){ //get that user's runs
			res.json(runs); //return it the runs in JSON format
		});
	});
});

controller.post('/', function(req, res){ //route for creating a new run
	Users.findById(req.session.currentUser.id).then(function(user){ //get the user from the DB
		Runs.create(req.body).then(function(createdRun){ //create a run from req.body data (JSON)
			user.addRun(createdRun).then(function(){ //add the run to the user
				res.json(createdRun); //return created run data
			});
		});;
	});
});

controller.delete('/:id', function(req, res){ //route for deleting a run
	Runs.destroy({ //destroy the run as specified by id in the url
		where: {
			id: req.params.id
		}
	}).then(function(didSucceed){
		res.json(didSucceed); //send back if it succeeded
	});
});

controller.put('/:id', function(req, res){ //alter a run
	Runs.update(
		req.body, //change the selected run to match the data passed in through req.body
		{
			where: {
				id: req.params.id //id of run in the db must match the id in the url
			}
		}
	).then(function(didSucceed){
		res.json(didSucceed); //respond with success status
	});
});

module.exports = controller;
