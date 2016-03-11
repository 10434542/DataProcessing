// Name: Ruben Timmermans
// Student-id: 10434542
// Student-mail: ruben.timmermans@student.uva.nl
// Sources:
// Image: https://wallpaperscraft.com/image/thermometer_temperature_discharge_glass_80744_1920x1080.jpg
// Crosshair: https://bl.ocks.org/mbostock/3902569

	var data1, data2, type;
	var Temps = ["TempGem", "TempMin", "TempMax"];

	// Colors to use for the lines
	var colors = ["green", "red", "blue"];
	var format_textbox = d3.time.format("%d %b %Y");
	var format_month = d3.time.format("%B");

	queue()
	.defer(d3.json, 'D3line.json')
	.defer(d3.json, 'D3MultiLine.json')
	.await(makeGraph);

	// Init svg, x, y and x and y axis
	var margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 1000 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // Init Lines
    var lineGem =	d3.svg.line()
        .x(function(d) { return x(new Date(d.Dates)); })
        .y(function(d) { return y(d.TempGem); });
    var lineMax =	d3.svg.line()
        .x(function(d) { return x(new Date(d.Dates)); })
        .y(function(d) { return y(d.TempMax); });
    var lineMin =	d3.svg.line()
        .x(function(d) { return x(new Date(d.Dates)); })
        .y(function(d) { return y(d.TempMin); });

    // Lists to use 
	var all_lines = [lineGem, lineMax, lineMin];

	function makeGraph(error, json1, json2) {

		// Store data in globals
		data1 = json1;
		data2 = json2;

		// Init type
		type = data1;

		// Find lowest mininmum and highest maximum from 2 datasets
        var minY = Math.min(d3.min(json2, function(d) {return d.TempMin}),
        		d3.min(json1,  function(d) { return d.TempMin})),
			maxY = Math.max(d3.max(json2, function(d) {return d.TempMax}),
				d3.max(json1,  function(d) { return d.TempMax}));

		// Set y domain merely once
        y.domain([minY, maxY]);

        // Make both axises
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Temperature (in 0.1 Celsius)");

        // Draw the graph via drawGraph
		drawGraph(type);
    };

	function drawGraph(type){

		// If other dataset, adjust minimum and maximum for x
		var min_x = new Date(type[0].Dates),
    		max_x = new Date(type[type.length - 1].Dates);

    	// Set x domain
    	x.domain([min_x, max_x]);

		// Removing lines and x axis if present
		console.log("hoi");
		d3.selectAll("path.line").remove();
		d3.selectAll("g.focus").remove();
		d3.select(".overlay").remove();
		d3.select("g.x.axis").remove();

		// Reset x axis
		x.domain([min_x, max_x]);
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
		svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		/* Draw the lines
		 eval tip source: 
		 //http://stackoverflow.com/questions/13858128/javascript-declare-variables-with-a-for-loop 
		*/
        for (var i = 0; i < 3; i++) {
        	svg.append("path")
        	.datum(type)
        	.attr("class", "line")
        	.attr("d", all_lines[i])
        	.style("stroke", colors[i]);
        };

        // Defining focusses
        for (var i = 1; i < 4; i++) {
        	eval( 'var focus' + i +' = svg.append("g").attr("class", "focus");' );
        };

        // Making focusses
        for (var i = 1; i < 4; i++) {
        	eval( 'focus' + i + '.append("circle").attr("r", 4.5)' );
        	eval( 'focus' + i + '.append("text").attr("x", 9).attr("dy", ".35em")');
        };

        d3.select("svg").append("text").attr("class", "curDate")
		.attr("width", 40)
		.attr("height", 20)
		.attr("transform", "translate("+2*margin.left+"," + 2*margin.top+")")

        // Making path to store focusses in
        var cross = svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)

        // Follow mouse over the lines
        cross.on("mousemove", mousemove);

        // Bisect date..
        bisectDate = d3.bisector(function(d) { return (new Date(d.Dates)); }).left

        // Function that tracks mousemove 
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]);
            console.log(x0);
			var i = bisectDate(type, x0, 1);	
			console.log(i);
			var d0 = type[i - 1];
			console.log(d0);
			var d1 = type[i];
			console.log(d1);
			var d = x0 - d0.Dates > d1.Dates - x0 ? d1 : d0;
			console.log(d);
			for (var i = 0; i < 3; i++) {
				eval('focus'+(i+1)+'.attr("transform", "translate(" + x(new Date(d.Dates)) + "," + y(d.'+Temps[i]+') + ")");');
				eval('focus'+(i+1)+'.select("text").text(d.'+Temps[i]/10+' +" Celsius");')
			};
			d3.select(".curDate")
			.text(format_textbox((new Date(d.Dates))));
        };
	};

	// Function that switches graph based on users click input
    function clickme(button) {
    	console.log("ik doe het");

    	if (button.value == "2015") {
    		type = data1;
    	};
    	if (button.value == "2014") {
    		type = data2;
    	};
    	drawGraph(type);
    };