var Sequelize = require('sequelize');
var db = require('./db.js');

var Users = db.define('user', {
	username: { 
		type: Sequelize.STRING,
		unique: true
	},
	password: Sequelize.STRING
});

db.sync();

module.exports = Users;
