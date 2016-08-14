var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

var runsController = require('./controllers/runs.js');
app.use('/runs/', runsController);

app.listen(PORT, function(){
	console.log('listening on port ' + PORT);
});
