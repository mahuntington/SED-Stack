var Sequelize = require('sequelize'); //require sequelize package

var DB_URL = process.env.DATABASE_URL || 'postgres://matthuntington@localhost:5432/sedstack'; //use either environment variable or static url

var db = new Sequelize(DB_URL); //create the connection.  Will not run multiple times, due to require cacheing the file

module.exports = db;
