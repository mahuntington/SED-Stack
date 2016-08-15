var Sequelize = require('sequelize');
var sequelize = new Sequelize('sedstack', 'matthuntington', '', {
	host: 'localhost',
	dialect: 'postgres'
});

var Runs = sequelize.define('run', {
	date: Sequelize.DATE,
	distance: Sequelize.FLOAT,
});

sequelize.sync();

module.exports = Runs;
