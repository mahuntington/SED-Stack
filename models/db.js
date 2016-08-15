var Sequelize = require('sequelize');

var db = new Sequelize('sedstack', 'matthuntington', '', {
	host: 'localhost',
	dialect: 'postgres'
});

module.exports = db;
