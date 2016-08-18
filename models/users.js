var Sequelize = require('sequelize');
var Runs = require('./run.js');
var db = require('./db.js');

var Users = db.define('user', {
	username: { 
		type: Sequelize.STRING,
		unique: true
	},
	password: Sequelize.STRING
});

Users.hasMany(Runs, { as: 'Runs' });

db.sync();

module.exports = Users;
