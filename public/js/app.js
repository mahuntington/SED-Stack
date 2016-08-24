// Initialize app
var WIDTH = 800; //width of svg
var HEIGHT = 600; //height of svg

var MAX_DISTANCE = 5; //max distance that can be run
var MIN_DISTANCE = 0; //min distance that can be run

var MIN_DATE = new Date('2016-1-1'); //min date of entry
var MAX_DATE = new Date('2017-1-1'); //max date of entry

d3.select('svg').style('height', HEIGHT).style('width', WIDTH); //set height/width of svg.  Could do this in CSS, but values are already here for other reasons


// Create scales
var yScale = d3.scaleLinear(); //create a linear scale
yScale.range([HEIGHT, 0]); //max height matches min data value, since max height is at the bottom
yScale.domain([MIN_DISTANCE, MAX_DISTANCE]); //min distance matches min data value, same for max values

var xScale = d3.scaleTime(); //set up scale for x coords and dates
xScale.range([0, WIDTH]);
xScale.domain([MIN_DATE, MAX_DATE]);


// SVG click handler
var lastTransform = null;
d3.select('svg').on('click', function(d){

	//d3.event contains data for click event
	var x = d3.event.offsetX; //use offset to get point within svg container
	var y = d3.event.offsetY;

	if(lastTransform !== null){
		x = lastTransform.invertX(d3.event.offsetX); //use offset to get point within svg container
		y = lastTransform.invertY(d3.event.offsetY);
	}

	var distance = yScale.invert(y); //get distance from click point in svg
	var date = xScale.invert(x); //get date from click point in svg

	logRun({ //log a run with data
		date: date,
		distance: distance
	}, render); //call the render callback
});

// Log a new run in the server
var logRun = function(runObject, callback){
	d3.request('/runs') //make a request to the server
		.header("Content-Type", "application/json") //tell the server we're sending JSON data
		.post(
			//must turn data object into string
			JSON.stringify(runObject),
			callback //call whatever callback is passed
		);

};

//Render circles
//var dateParser = d3.time.format("%Y-%m-%d %H:%M:%S.%L +00:00"); -- can use this if date format is not proper
var render = function(){
	d3.json('/runs', function(error, data){ //get all run data
		//bind circles with data
		var circles = d3.select('#points').selectAll('circle')//ghost selction of circles
			.data(data, function(d){
				//match data based on d.id, not index
				return d.id
			});
		//add extra circles if there is extra data
		circles
			.enter() //for all data that has not yet been mapped...
			.append('circle') //create a circle
			.attr('cx', function(datum, index){
				//convert date value into pixel value and set it to cx
				return xScale(new Date(datum.date));
			})
			.attr('cy', function(datum, index){
				//convert distance datum into pixel value and set it to cy
				return yScale(datum.distance);
			});
		//if any circles remain that don't match data, remove them
		circles.exit().remove();
		//attach event handlers after circle creation
		attachDragHandlers(); //attach drag handlers
		attachDeleteHandlers(); //attach delete handlers
	});
};

render(); //render on page load

//Attach click handler to circles
var attachDeleteHandlers = function(){
	d3.selectAll('circle').on('click', function(d){
		//prevent svg click for run creation
		d3.event.stopPropagation();

		//if not dragging (event's default is not prevented)
		if(!d3.event.defaultPrevented){
			//mkae API call
			d3.request('/runs/'+d.id)
				.header("Content-Type", "application/json") //we're sending data
				.send('DELETE', render); //send a DELETE request
		}
	});
};

//Attach drag handler to circles
var attachDragHandlers = function(){
	//create drag behavior
	var drag = d3.drag()
		.on('end', function(d){ //when dragging has finished
			//prevent default for deleting run handler
			d3.event.sourceEvent.preventDefault();

			//set new date and distance on datum object
			var date = xScale.invert(d3.event.x); //d3.event.x is used for drag behavior... different from normal click event
			var distance = yScale.invert(d3.event.y);
			d.date = date; //update data on element
			d.distance = distance;

			//make api call to update DB
			d3.request('/runs/'+d.id)
				.header("Content-Type","application/json") //we're sending JSON
				.send('PUT', JSON.stringify(d), render);//pass alterted 'd' object to API
		})
		.on('drag', function(d){ //while dragging...
			//change position of cirlce
			var x = d3.event.x; //get new position from d3.event.x
			var y = d3.event.y; //get new position from d3.event.y
			d3.select(this).attr('cx',x); //update element visually
			d3.select(this).attr('cy',y);
		});
	//attach drag behavior to circle elements
	d3.selectAll('circle').call(drag);
};

//create axes
var xAxis = d3.axisBottom(xScale); //create axis, not yet applied
var yAxis = d3.axisLeft(yScale); //create axis, not yet applied
d3.select('svg').append('g').attr('id', 'x-axis').attr('transform', 'translate(0,' + HEIGHT + ')').call(xAxis); //apply xAxis, also, x axis must be moved to bottom of svg
d3.select('svg').append('g').attr('id', 'y-axis').call(yAxis); //y axis is good as it is, apply it

//callback for zooming
var zoomCallback = function(){
	lastTransform = d3.event.transform;
	d3.select('#points').attr("transform", d3.event.transform); //apply transform to g element containing circles
	//recalculate the axes
	d3.select('#x-axis').call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
	d3.select('#y-axis').call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
}
var zoom = d3.zoom().on('zoom', zoomCallback); //create zoom behavior
d3.select('svg').call(zoom); //apply zoom behavior to svg
