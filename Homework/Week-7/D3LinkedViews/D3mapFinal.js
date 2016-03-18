// Name: Ruben Timmermans
// Student-id: 10434542
// Student-mail: ruben.timmermans@student.uva.nl
// Sources:
// dataset 1 from: //https://github.com/highcharts/highcharts/blob/master/samples/data/world-population-density.json
// documentation: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
// background: http://p1.pichost.me/i/41/1649099.jpg
// converter: http://www.convertcsv.com/csv-to-json.htm
// dataset 2(income per capita): http://databank.worldbank.org/data/reports.aspx?source=2&Topic=3#advancedDownloadOptions
// dataset interactive (population worldwide) :http://peric.github.io/GetCountries/
/*

Extra Comment on my own code: I have spent to much time in fixing the local hosts en import of css issues that
I couldn't actually figure out how to properly fix the ticks for the years. My bad.. 
Extra comment on the course: perhaps next time this course takes place some more extra time could be spent on
How Javascript actually works (compared to other languages like for instance: C or PHP)
I had to manually figure out that apperently JS also uses pointers (with some help of a programmers best friend: internet->google),
which lead to quite some delays to this work. Even though I have been a little bit pessimistic I did find the help from Kim very useful
thx Kim.
*/

	
	// Globals:
	var bar_present = false;
	var bool_data1 = true;
	var data2;
	var data_x = [];
	var offset = 100;
	var dataset1 = {};
	var dataset2 = {};
	var map1;
	var cur_data ={};
	var fills_density = {defaultFill: "#bdbdbd",
		q0: "#fee0d2",
		q1: "#fcbba1",
		q2: "#fc9272",
		q3: "#fb6a4a",
		q4: "#ef3b2c",
		q5: "#cb181d",
		q6: "#a50f15",
		q7: "#67000d",
		q8: "darkred",
		};

	// Init margins
	var margin = {top: 20, right: 30, bottom: 30, left: 40},
	    width = 1200 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom;
	// Init tip
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
	// Make chart
	var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	// Source: http://stackoverflow.com/questions/8935632/check-if-character-is-number
	function isNumeric(obj) {
		return obj - parseFloat(obj) >= 0;
	};

	// function to find the extreme values
	function findExtreme(list, type) {
		var max = 0;
		var min = 0;
		for (var i = 0; i < list.length; i++) {
			if (list[i] >= max) {
				max = list[i];
			};
			if (list[i] <= min) {
				min = list[i];
			};
		};
		if (type == 1) {
			return max;
		}
		else if (type == 2) {
			return min;
		}
		else {
			return "type != valid"
		};
	};

	// function to filter data
	function filterData(obj, element, type) {
		var list = []
		for (var key in obj[element]) {
			var count_nr = 0;
			for (var index = 0; index < key.length; index++) {
				if (isNumeric(key[index])) {
					count_nr += 1;
				}
			};
			if (count_nr > 0) {
				if (type == 1) {
					list.push(key)
				}
				else if (type == 2) {
					list.push(parseInt(key.substr(2)));
				};
			};
		};
		return list;
	};

	// Load all the datasets and then execute makeInfographs
	queue()
	.defer(d3.json, 'D3MapData.json')
	.defer(d3.json, 'D3final.json')
	.defer(d3.json, 'Worldpop.json')
	.await(makeInfographs);

	// Dummy list to
	function makeInfographs(error, json1, json2, json3) {
		data1 = json1;
		data2 = json2;
		data3 = json3;

		var max = d3.max(data1, function(d) { return d.val}),
    		min = d3.min(data1, function(d) { return d.val});

    	// Map values between 0 and 200 to colors using a string identifier
		var quantize = d3.scale.quantize()
		.domain([0, 200])
		.range(d3.range(9).map(function(i) { return "q" + i; }));

		// Create a new dictionary in the right format to use in the datamap
		for(var i = 0; i < data1.length; i++) {
			dataset1[data1[i].country] = { fillKey: quantize(data1[i].val).toString(),
										 people: data1[i].val,
										 name: data1[i].country_name };
		};
		// create init dictionary (had to due to unable to clone json type dictionary)
		for(var i = 0; i < data1.length; i++) {
			cur_data[data1[i].country] = { fillKey: quantize(data1[i].val).toString(),
										 people: data1[i].val,
										 name: data1[i].country_name };
		};

		// Function to map value to string ("i" + q)
		var quantize = d3.scale.quantize()
		.domain([d3.min(data3, function(d) {return d.population}), d3.max(data3, function(d) {return d.population}) ])
		.range(d3.range(9).map(function(i) { return "q" + i; }));

		for(var i = 0; i < data3.length; i++) {
			dataset2[data3[i].Ccode] = { fillKey: quantize(data3[i].population).toString(),
									 people: data3[i].population,
									 name: data3[i].Ccode };
		};
		// init sentence
		var sentence = (bool_data1 ? "Density ":"Population " );
		// Create Datamap
    	map1 = new Datamap({
    	element: document.getElementById('container'),
		done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            	// de eerste shit werkt voor doorgeven van data1 naar makebarchart om daar
            	// met data2 verder te gaan
            	if (bar_present === false) {
                	makeBarchart(geography.id);
                	bar_present = true;
                };
                if (bar_present === true) {
                	updateBarchart(geography.id);
                };
            });
        },
        // Fill colors
		fills: fills_density,
		// Parse earlier adjusted dictionary
		data: cur_data,

		/* Interactivy: click on country to search country in google search engine
		   Onhover: shows country name and people density per square mile value
		*/
		geographyConfig: {
			highlightBorderColor: 'darkred',
			popupTemplate: function(geography, data) {
				var sentence = (bool_data1 ? "Density ":"Population " );
				return '<div class="hoverinfo">'+sentence + data.people +
				 	'<br> Country:' + data.name+'</br></div>';
			},
			highlightBorderWidth: 1
  		}
    	});
    };

    // Function: onclick updates datamp with new dataset
    function clickme(button) {
    	if (button.value == "Density") {
    		bool_data1 = true;
			map1.updateChoropleth(
				dataset1
			);
    	};
    	if (button.value == "Population") {
    		bool_data1 = false;
    		map1.updateChoropleth(
				dataset2
			);
    	};
    };

    // Function that returns lis of values of keys
    function getValues(obj, check1, check2) {
    	var list = [];
    	for (var key in obj) {
			if (check1 == obj[key][check2]) {
				// loop within 1 object
				for (var val in obj[key]) {
					if (isNumeric(obj[key][val].substr(0,1))) {
						list.push(parseFloat(obj[key][val]));
					}
				}
			}
		}
		return list;
    };

    function updateBarchart(countrycode) {
    	// Init data, clone data
    	var data_y = getValues(data2, countrycode,"Ccode").slice(2);
    	var new_data_y = data_y.slice();

    	// Filter data, define max/min/len/barWitdh
		var data_x = filterData(data2, 0, 2).slice(2),
			max = findExtreme(data_y, 1), min = findExtreme(data_y, 2),
			len = data_x.length,
			barWidth = width / len;

		d3.select(".y.axis").remove();

		// Scale for y
		var yScale = d3.scale.linear()
		.domain([min, max+offset])
		.range([height, 0])

		// Make tip
		tip.html(function(d, i) {
			return "<br><strong>Income (US $):</strong> <span style='color:red'>" + parseInt(new_data_y[i]) + "</span></br>"
			+"<br><strong>Year:</strong> <span style='color:red'>" + data_x[i] + "</span></br>";
		})

		chart.call(tip)
		for (var i = 0; i < data_y.length; i++) {
			data_y[i] = yScale(data_y[i]);
		};
		// Scale for y
		var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

		// Make Barchart
		chart.append("g")
		.attr("class", "y axis")
		.transition().duration(100)
		.call(yAxis);

		d3.selectAll("rect").remove();

		chart.selectAll(".bar")
		.data(data_y)
		.enter().append("rect")
		.on('mouseover', tip.show)
      	.on('mouseout', tip.hide)
		.transition()
		.duration(200)
		.attr("class", "bar")
		.attr("fill", "orange")
		.attr("x", function(d, i) { return i*barWidth; })
		.attr("width", barWidth)
		.attr("y", function(d, i) { return data_y[i];  })
		.attr("height", function(d, i) { return (height - data_y[i]); })
    };


	function makeBarchart(countrycode) {

    	// Init data, clone data (source: http://jsperf.com/cloning-arrays/3))
		var data_y = getValues(data2, countrycode,"Ccode").slice(2);
		var new_data_y = data_y.slice()

		// filter data, define max/min/len/barWitdh
		var data_x = filterData(data2, 0, 2).slice(2),
			max = findExtreme(data_y, 1), min = findExtreme(data_y, 2),
			len = data_x.length,
			barWidth = width / len;

		// Make tip
		tip.html(function(d) {
		return "<br><strong>Income (US $):</strong> <span style='color:red'>" + parseInt(new_data_y[i]) + "</span></br>"
				+"<br><strong>Country:</strong> <span style='color:red'>" + data_x[i] + "</span></br>";
		});

		chart.call(tip);

		// Init scales
		var yScale = d3.scale.linear()
			.domain([min, max+offset])
			.range([height, 0]),
			xScale = d3.time.scale()
			.domain([new Date(data_x[0],1,1), new Date(data_x[data_x.length -1], 1, 1)])
			.range([0, width])

		// Convert data to scaled data
		for (var i = 0; i < data_y.length; i++) {
			data_y[i] = yScale(data_y[i]);
		};
		// Init axis
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient("left"),
			xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		// Draw bargraph
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
		.text("Income per Capita (US Dollars)");

		chart.selectAll(".bar")
		.data(data_y)
		.enter().append("rect")
		.on('mouseover', tip.show)
      	.on('mouseout', tip.hide)
		.transition()
		.duration(200)
		.attr("class", "bar")
		.attr("fill", "orange")
		.attr("x", function(d, i) { return i*6; })
		.attr("width", barWidth)
		.attr("y", function(d, i) { return data_y[i];  })
		.attr("height", function(d, i) { return (height - data_y[i]); })
	};
