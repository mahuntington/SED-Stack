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
	}, render);
});

// Log a new run in the server
var logRun = function(runObject, callback){
	d3.xhr('/runs')
		.header("Content-Type", "application/json")
		.post(
			JSON.stringify(runObject),
			callback
		);

};

//Render circles
//var dateParser = d3.time.format("%Y-%m-%d %H:%M:%S.%L +00:00");
var render = function(){
	d3.json('/runs', function(error, data){
		var circles = d3.select('svg').selectAll('circle')
			.data(data, function(d){
				//match data based on d.id, not index
				return d.id
			});
		circles
			.enter()
			.append('circle').attr('r', 5)
			.attr('cx', function(datum, index){
				return xScale(new Date(datum.date));
			})
			.attr('cy', function(datum, index){
				return yScale(datum.distance);
			});
		circles.exit().remove();
		//attach event handlers after circle creation
		attachDragHandlers();
		attachDeleteHandlers();
	});
};

render();

//Attach click handler to circles
var attachDeleteHandlers = function(){
	d3.selectAll('circle').on('click', function(d){
		d3.event.stopPropagation();
		if(!d3.event.defaultPrevented){
			d3.xhr('/runs/'+d.id)
				.header("Content-Type", "application/json")
				.send('DELETE', render);
		}
	});
};

var attachDragHandlers = function(){
	var drag = d3.behavior.drag()
		.on('dragend', function(d){
			d3.event.sourceEvent.preventDefault();
			d3.event.sourceEvent.stopPropagation();

			var date = xScale.invert(d3.event.sourceEvent.offsetX);
			var distance = yScale.invert(d3.event.sourceEvent.offsetY);
			d.date = date;
			d.distance = distance;
			d3.xhr('/runs/'+d.id)
				.header("Content-Type","application/json")
				.send('PUT', JSON.stringify(d), render);
		})
		.on('drag', function(d){
			var dx = d3.event.x;
			var dy = d3.event.y;
			d3.select(this).attr('cx',dx);
			d3.select(this).attr('cy',dy);
		});
	d3.selectAll('circle').call(drag);
};
