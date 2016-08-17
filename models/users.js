var Sequelize = require('sequelize');
var db = require('./db.js');

var Users = db.define('user', {
	username: Sequelize.STRING,
	password: Sequelize.STRING
});

db.sync();

module.exports = Users;
