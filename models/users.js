var Sequelize = require('sequelize'); //require sequelize package
var Runs = require('./run.js'); //require our Runs model
var db = require('./db.js'); //require connection to the DB

var Users = db.define('user', { //set up model for Users
	username: {
		type: Sequelize.STRING, //string data type
		unique: true //each value must be unique in the DB
	},
	password: Sequelize.STRING //string for password
});

Users.hasMany(Runs, { as: 'Runs' }); //set up the relationship that Users have many runs.  Will create a user_id column in the Runs table

db.sync(); //if table does not exist yet, create it

module.exports = Users;
