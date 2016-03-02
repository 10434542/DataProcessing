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
	monthform = d3.time.format("%B");
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


	/*var chart = d3.select(".chart")
    .attr("width", width +margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);*/
    var dates_filtered;

	var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var y = d3.scale.linear()
    .range([height, 0]);

    var x = d3.scale.linear()
    .range([0, width]);



	d3.json("dataset.json", function(error, json) {

		var len = json.length;
		var barWidth = width / len;
		// get right date format, filter this list and store into dates_filtered
		dates =[];
		for (var i = 0; i < len; i++) {
			dates.push(monthform(new Date(json[i].jsonDate)));
		};
		dates_filtered = filter(dates);
		console.log(dates_filtered);

		var xAxis = d3.svg.axis()
		.scale(x)
		.ticks(12).tickFormat(function(d) { console.log(dates_filtered[d]); return dates_filtered[d]})
		.orient("bottom")
		//.ticks(12)//.tickValues(dates_filtered);
		// .tickFormat(function(d) { return dates_filtered[d]})
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

		// 0 to 12 (january '15 to january '16)
		x.domain([0,11]);
		console.log(x.domain);

		y.domain([0, d3.max(json, function(d) { return d.Rain})]);


		/*console.log(getDatesD3(json, len, monthform, new Date, jsonDate));*/




		chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

		chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);

		chart.selectAll(".bar")
		.data(json)
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d, i) { return i*barWidth; })
		.attr("y", function(d) { return y(d.Rain); })
		.attr("height", function(d) { return height - y(d.Rain); })
		.attr("width", barWidth).attr("color", "blue");
	});



