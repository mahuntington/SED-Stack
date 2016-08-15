// Initialize app
var WIDTH = 800;
var HEIGHT = 600;

var MAX_DISTANCE = 5;
var MIN_DISTANCE = 0;

var MIN_DATE = new Date('2016-1-1');
var MAX_DATE = new Date('2017-1-1');

d3.select('svg').style({
	height: HEIGHT,
	width: WIDTH
});


// Create scales
var yScale = d3.scale.linear();
yScale.range([HEIGHT, 0]);
yScale.domain([MIN_DISTANCE, MAX_DISTANCE]);

var xScale = d3.time.scale();
xScale.range([0, WIDTH]);
xScale.domain([MIN_DATE, MAX_DATE]);


// SVG click handler
d3.select('svg').on('click', function(d){
	
	var x = d3.event.offsetX;
	var y = d3.event.offsetY;

	var distance = yScale.invert(y);
	var date = xScale.invert(x);

	logRun({
		date: date, 
		distance: distance
	});
});

// Log a new run in the server
var logRun = function(runObject){
	d3.xhr('/runs')
		.header("Content-Type", "application/json")
		.post(
			JSON.stringify(runObject),
			function(err, data){
				console.log(JSON.parse(data.response));
			}
		);

};

//var dateParser = d3.time.format("%Y-%m-%d %H:%M:%S.%L +00:00");
var render = function(){
	d3.json('/runs', function(error, data){
		var circles = d3.select('svg').selectAll('circle')
			.data(data).enter()
			.append('circle').attr('r', 5);
		circles.attr('cx', function(datum, index){
			return xScale(new Date(datum.date));
		});
		circles.attr('cy', function(datum, index){
			return yScale(datum.distance);
		});
	});
};

render();
