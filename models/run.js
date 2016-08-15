var Sequelize = require('sequelize');
var db = require('./db.js');

var Runs = db.define('run', {
	date: Sequelize.DATE,
	distance: Sequelize.FLOAT,
});

db.sync();

module.exports = Runs;
