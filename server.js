var express = require('express');
var session = require('express-session');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(session({
	secret: "seakrett",
	resave: false,
	saveUninitialized: false
}));

app.use(express.static('public'));

app.get('/', function(req, res){
	res.render('index.ejs', {
		currentUser: req.session.currentUser
	});
});

var runsController = require('./controllers/runs.js');
app.use('/runs/', runsController);

var usersController = require('./controllers/users.js');
app.use('/users/', usersController);

var loginsController = require('./controllers/logins.js');
app.use('/logins/', loginsController);

app.listen(PORT, function(){
	console.log('listening on port ' + PORT);
});
