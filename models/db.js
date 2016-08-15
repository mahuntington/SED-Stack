var Sequelize = require('sequelize');

var DB_URL = process.env.DATABASE_URL || 'postgres://matthuntington@localhost:5432/sedstack';

var db = new Sequelize(DB_URL);

module.exports = db;
