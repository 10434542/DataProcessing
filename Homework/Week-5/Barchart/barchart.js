// Name: Ruben Timmermans
// Student-id: 10434542
// Mail: ruben.timmermans@student.uva.nl
// Sources: http://www.convertcsv.com/csv-to-json.htm

	//http://snipplr.com/view/45323/remove-duplicate-values-from-array/
	var filter = function(array1) {
				    var array2 = [];
				    var len = array1.length;
				 
				    for ( var i = 0; i < len; i++ ) {
				        var found = false;
				        for ( var j = 0; j < array2.length; j++ ) {
				            if ( array1[i] === array2[j] ) { 
				              found = true;
				              break;
				            };
				        };
				        if ( !found) array2.push( array1[i] );    
				    };
				   return array2;
				};

	var monthform = d3.time.format("%B");
	var dates_filtered;

	// init
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // make chart
	var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // creating barchart
	d3.json("dataset.json", function(error, json) {
		var y = d3.scale.linear()
		.domain([0, d3.max(json, function(d) { return d.Rain})])
		.range([height, 0]);

		console.log(d3.max(json, function(d) { return d.Rain}))
		var x = d3.scale.linear().domain([0,12])
		.range([0, width]);

		var len = json.length;
		var barWidth = width / len;
		
		// get right date format, filter this list and store into dates_filtered
		dates =[];
		for (var i = 0; i < len; i++) {
			dates.push(monthform(new Date(json[i].jsonDate)));
		};
		dates_filtered = filter(dates);
		dates_filtered.push("January");
		console.log(dates_filtered);

		// define x axis
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(12)
		.tickFormat(function(d, i) { console.log(dates_filtered[i]); return dates_filtered[i]})

		// define y axis
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

		var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
		return "<strong>Rain (in mm):</strong> <span style='color:red'>" + d.Rain + "</span>";
		})

		chart.call(tip);

		chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Rain (in mm)");

		chart.selectAll(".bar")
		.data(json)
		.enter().append("rect")
		.attr("class", "bar")
		.on('mouseover', tip.show)
      	.on('mouseout', tip.hide)
		.transition()
        .delay(function (d, i) { return i*5; })
		.attr("x", function(d, i) { return i*barWidth; })
		.attr("y", function(d) { return y(d.Rain); })
		.attr("height", function(d) { return height - y(d.Rain); })
		.attr("width", barWidth)

	});



