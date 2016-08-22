var express = require('express'); //include express package
var session = require('express-session'); //include express sessions for session work
var app = express(); // create an express app
var PORT = process.env.PORT || 3000; //define the port to be either the environment variable, or 3000

app.use(session({ //setting up session encryption info
	secret: "seakrett", //unique keyword for encrypting session data
	resave: false, // don't resave session if nothing changed
	saveUninitialized: false //even if no data, set a cookie
}));

app.use(express.static('public')); //set up a static asset dir in /public

app.get('/', function(req, res){ // route for /
	res.render('index.ejs', { // render /views/index.ejs
		currentUser: req.session.currentUser //pass in session currentUser var to view
	});
});

var runsController = require('./controllers/runs.js'); //require runsController
app.use('/runs/', runsController); //use it for anything starting with /runs

var usersController = require('./controllers/users.js');
app.use('/users/', usersController);

var loginsController = require('./controllers/logins.js');
app.use('/logins/', loginsController);

app.listen(PORT, function(){ //start the server
	console.log('listening on port ' + PORT);
});
