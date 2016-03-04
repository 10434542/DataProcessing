// Name: Ruben Timmermans
// Student-id: 10434542
// Student-mail: ruben.timmermans@student.uva.nl
// Sources:
// data from: //https://github.com/highcharts/highcharts/blob/master/samples/data/world-population-density.json
// documentation: https://github.com/markmarkoh/datamaps/blob/master/README.md#getting-started
// background: http://p1.pichost.me/i/41/1649099.jpg
	function toURL (array) {

		window.open("https://www.google.nl/webhp?hl=nl#hl=nl&q="+
					(array.split(" ")).join("+"));

	};
	// Dummy list to 
	var json_density =[];
	d3.json("D3mapData.json", function(json) {

		// Not used in further computation due to insane max value..
    	var max = d3.max(json, function(d) { return d.val});
    	var min = d3.min(json, function(d) { return d.val});
    	
    	// Toggle comment below to be amazed:
    	/*console.log(max);
    	console.log(min);*/

    	// Map values between 0 and 200 to colors using a string identifier
		var quantize = d3.scale.quantize()
		.domain([0, 200])
		.range(d3.range(9).map(function(i) { return "q" + i; }));

		window.dataset = {}

		// Create a new dictionary in the right format to use in the datamap
		for(var i = 0; i < json.length; i++) {
			dataset[json[i].country] = { fillKey: quantize(json[i].val).toString(),
										 people: json[i].val,
										 country: json[i].country_name };
		};
		// Create Datamap
    	var map = new Datamap({
    	element: document.getElementById('container'),
		done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                toURL(geography.properties.name);
            });
        },
        // Fill colors
		fills: {
		defaultFill: "#bdbdbd",
		authorHasTraveledTo: "#fa0fa0",
		q0: "#fee0d2",
		q1: "#fcbba1",
		q2: "#fc9272",
		q3: "#fb6a4a",
		q4: "#ef3b2c",
		q5: "#cb181d",
		q6: "#a50f15",
		q7: "#67000d",
		q8: "darkred",
		},
		// Parse earlier adjusted dictionary
		data: dataset,

		/* Interactivy: click on country to search country in google search engine
		   Onhover: shows country name and people density per square mile value
		*/
		geographyConfig: {
			highlightBorderColor: 'darkred',
			popupTemplate: function(geography, data) {
				return '<div class="hoverinfo">'+'People per square mile:' + data.people +
				 '<br> Country:' + data.country+'</br></div>';
				},
			highlightBorderWidth: 1
  		}
    	});
    });




