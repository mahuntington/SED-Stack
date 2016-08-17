// Initialize app
var WIDTH = 800;
var HEIGHT = 600;

var MAX_DISTANCE = 5;
var MIN_DISTANCE = 0;

var MIN_DATE = new Date('2016-1-1');
var MAX_DATE = new Date('2017-1-1');

d3.select('svg').style('height', HEIGHT).style('width', WIDTH);


// Create scales
var yScale = d3.scaleLinear();
yScale.range([HEIGHT, 0]); //max height matches min data value, since max height is at the bottom
yScale.domain([MIN_DISTANCE, MAX_DISTANCE]);

var xScale = d3.scaleTime();
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
	d3.request('/runs')
		.header("Content-Type", "application/json")
		.post(
			//must turn data object into string
			JSON.stringify(runObject),
			callback
		);

};

//Render circles
//var dateParser = d3.time.format("%Y-%m-%d %H:%M:%S.%L +00:00");
var render = function(){
	d3.json('/runs', function(error, data){
		//bind circles with data
		var circles = d3.select('svg').selectAll('circle')//ghost selction of circles
			.data(data, function(d){
				//match data based on d.id, not index
				return d.id
			});
		//add extra circles if there is extra data
		circles
			.enter()
			.append('circle')
			.attr('cx', function(datum, index){
				//convert date value into pixel value
				return xScale(new Date(datum.date));
			})
			.attr('cy', function(datum, index){
				//convert distance datum into pixel value
				return yScale(datum.distance);
			});
		//if any circles remain that don't match data, remove them
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
		//prevent svg click for run creation
		d3.event.stopPropagation();
	
		//if not dragging (event's default is not prevented)
		if(!d3.event.defaultPrevented){
			//mkae API call
			d3.request('/runs/'+d.id)
				.header("Content-Type", "application/json")
				.send('DELETE', render);
		}
	});
};

//Attach drag handler to circles
var attachDragHandlers = function(){
	//create drag behavior
	var drag = d3.drag()
		.on('end', function(d){
			//prevent default for deleting run handler
			d3.event.sourceEvent.preventDefault();

			//set new date and distance on datum object
			var date = xScale.invert(d3.event.x);
			var distance = yScale.invert(d3.event.y);
			d.date = date;
			d.distance = distance;

			//make api call
			d3.request('/runs/'+d.id)
				.header("Content-Type","application/json")
				.send('PUT', JSON.stringify(d), render);//pass alterted 'd' object to API
		})
		.on('drag', function(d){
			//change position of cirlce while draging
			var x = d3.event.x;
			var y = d3.event.y;
			d3.select(this).attr('cx',x);
			d3.select(this).attr('cy',y);
		});
	//attach drag behavior to circle elements
	d3.selectAll('circle').call(drag);
};

d3.select('svg').append('g').attr('transform', 'translate(0,' + HEIGHT + ')').call(d3.axisBottom(xScale));
d3.select('svg').append('g').call(d3.axisLeft(yScale));
