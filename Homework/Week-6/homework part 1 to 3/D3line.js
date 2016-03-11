// Name: Ruben Timmermans
// Student-id: 10434542
// Student-Mail: ruben.timmermans@student.uva.nl
// Sources:
// Crosshair inspired by: https://bl.ocks.org/mbostock/3902569
// Image: https://wallpaperscraft.com/image/thermometer_temperature_discharge_glass_80744_1920x1080.jpg

    // Init variables to use later on
    var formatValue = d3.format(",.2f"),
        formatTemp = function(d) { return formatValue(d)/10 + "Celsius"; };
    var format_textbox = d3.time.format("%d %b %Y");


    // Init graph
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

    var line = d3.svg.line()
        .x(function(d) { return x(new Date(d.Dates)); })
        .y(function(d) { return y(d.TempGem); });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Import data and draw graph
    d3.json("D3line.json", function(error, json) {
        
        var min = new Date(json[0].Dates);
        var max = new Date(json[json.length - 1].Dates);
        x.domain([min, max]);
        y.domain(d3.extent(json, function(d) { return d.TempGem; }));

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

        svg.append("path")
        .datum(json)
        .attr("class", "line")
        .attr("d", line);

        var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

        focus.append("circle")
        .attr("r", 4.5);

        focus.append("text")
        .attr("x", 9)
        .attr("dy", ".35em");

        d3.select("svg").append("text").attr("class", "curDate")
        .attr("width", 40)
        .attr("height", 20)
        .attr("transform", "translate("+2*margin.left+"," + 2*margin.top+")");

        // Make path for crosshair
        svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

        // Bisect date..
        bisectDate = d3.bisector(function(d) { return (new Date(d.Dates)); }).left

        // Function that tracks mousemove 
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(json, x0, 1),
                d0 = json[i - 1],
                d1 = json[i],
                d = x0 - d0.Dates > d1.Dates - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(new Date(d.Dates)) + "," + y(d.TempGem) + ")");
            focus.select("text").text(formatTemp(d.TempGem));
            d3.select(".curDate")
            .text(format_textbox((new Date(d.Dates))));
        };
    });
