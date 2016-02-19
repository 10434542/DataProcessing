// Name: Ruben Timmermans
// Student #: 10434542
// Sources:
// library for using Canvas:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// Image for background of .html file:
// http://www.hdwallpapersnew.net/wp-content/uploads/2015/11/awesome-clouds-full-screen-high-definition-desktop-wallpaper-background-pictures.jpg
// CSS source:
// https://wdexplorer.com/20-examples-beautiful-css-typography-design/

	// Variables to use later on
	var offsetX;
	var offsetY;
	var kilo = 1000;
	var hour = 3600;
	var day = 24;
	var temps = [];
	var dates = [];
	var result = [];
	var graphdates = [];
	window.canvas = document.getElementById("mycanvas");
	window.ctx = canvas.getContext("2d");

	// Function that rewrites raw data to useful data
	function rewritedata() {
		temps = [];
		dates = [];
		result = [];
		var newdat = document.getElementById("rawdata").innerHTML.split("\n");
		var date = "";
		var temp = "";
		//console.log(newdat)
		for (var i = 0; i < newdat.length-1; i++) {
			temp = newdat[i].split(",");
			console.log(temp[1]);
			date = temp[1].substr(0,4)+"/"+temp[1].substr(4,2)+"/"+temp[1].substr(6,2);
			temps.push(parseInt(temp[2]));
			dates.push(new Date(date));
			result.push(date+","+temp[2]);
		};
		return temps, dates, result;
	};
	rewritedata();

	// Function that draws a line
	function drawline(x1, x2, y1, y2) {
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	};
	// Function to get minimum value
	function getminval(array1) {
		var min = 0;
		for (var i = 0; i < array1.length; i++) {
			if (array1[i] < min) {
				min = array1[i]
			};
		};
		return parseInt(min);
	};

	// Convert dates from csv to days, using dummy variable "year"
	var year = new Date("2015/01/01")
	for (var i = 0; i < dates.length; i++) {
		graphdates[i] = Math.ceil((dates[i].getTime() - year.getTime()) /(kilo * hour * day))
	};

	// Function to get maximum value
	function getmaxval(array2) {
		var max = 0;
		for (var i = 0; i < array2.length; i++) {
			if (array2[i] > max) {
				max = array2[i]
			};
		};
		return parseInt(max);
	};
	// Init_canvas
	function init_canvas(length, height, off_x, off_y) {
		canvas.width  = length; // in pixels
		canvas.height = height;
		offsetX = off_x;
		offsetY = off_y;			
	};
	// Initialization of size of canvas + drawing lines for axis
	init_canvas(600, 400, 50, 50);
	drawline(offsetX,offsetX, offsetY, canvas.height-offsetY);
	drawline(offsetX, canvas.width-offsetX,canvas.height - offsetY, canvas.height - offsetY);

	function createTransform(domain, range){
		/* domain is a two-element array of the data bounds [domian_min, domian_max]
		\\ range is a two-element array of the screen bounds [range_min, range_max]
		\\ This gives you two equations to solve:
		\\ range_min = alpha * domain_min + beta
		\\ range_max = alpha * domain_max + beta
		\\ Implement your solution here:*/
		var alpha = (range[0]-range[1])/(domain[0]-domain[1]);
		var beta = range[1]-alpha*domain[1];

		return function(x) {
			return alpha * x + beta;
		};
	};

	// function to map data to pixels using createTransform function
	function mapData(array, d_min, d_max, r_min, r_max) {
		var mappedData = [];
		var mapped = createTransform([d_min, d_max], [r_min, r_max]);
		for (var i = 0; i < array.length; i++) {
			mappedData[i] = mapped(array[i]);
		};
		return mappedData;
	};

	// Function to plot a 2D graph
	function drawGraph(array_x, array_y) {
		for (var i = 0; i < array_y.length; i++){
			ctx.moveTo(array_x[i], array_y[i]);
			ctx.lineTo(array_x[i +1], array_y[i + 1]);
			ctx.stroke();
		};
	};

	// Drawing the actual needed graph for this excersize
	drawGraph(mapData(graphdates, graphdates[0], graphdates[graphdates.length - 1], offsetX, canvas.width - offsetX),
			mapData(temps, -100, 300, canvas.height - offsetY, offsetY));


	// Scales values for the x and y axis
	function scaleAxis(d_min, d_max, r_min, r_max, step) {
		var positions = [];
		var temporary_transform = createTransform([d_min, d_max], [r_min, r_max])
		for (var i = d_min; i < d_max + 1; i += step) {
			positions[i] = Math.ceil(temporary_transform(i));
		};

		return positions;
	};

	// Used to make a dictionary later on
	months = ["January", "February", "March", "April", "May", "June", "July",
			"August", "September", "October", "November", "December"]

	// makes an associative array (dictionary) from to arrays: array1, array2
	function mergeArrays(array1, array2, len) {
		associative_array = {};
		for (var i = 0; i < array1.length; i++) {
			associative_array[array1[i]] = array2[i+1];
			if ( i >= len) {
				i = i%len;
			};
		};
		return associative_array;

	};

	var test11 = scaleAxis(1, 12, offsetX, canvas.width - offsetX, 1);
	// Draws text at x and y axis
	var test123 = mergeArrays(months, test11, 12);
	

	// Function that handels different types of objects to use its contents to set along
	// the x and y axis. 
	function drawText(array, beginx, beginy, distance, rotation, type, step, array_pixels) {
		if (type == 1) {
			step = 0;
			array_pixels;
			for (var i in array) {
				ctx.save();
				ctx.translate(beginx + array[i], beginy + distance);
				ctx.rotate(rotation);
				ctx.textAlign = "center";
				ctx.fillText(i, 0, 0);
				ctx.restore()

			};
		};
		if (type == 2) {
			for (var i = 1; i < array.length +1; i++) {
				ctx.save();
				ctx.translate(beginx - distance, beginy + array_pixels[i]);
				ctx.rotate(rotation);
				ctx.textAlign = "center";
				ctx.fillText(array[i], 0, 0);
				ctx.restore();
				//beginy -= step;
			};
		}
	};

	// I am sorry, i needed to hard code the values for the y axis...
	var trans = createTransform([-10, 30],[canvas.height - offsetY, offsetY]);
	var definiteY = []
	valuesY = [-10, -5, 0, 5, 10, 15, 20, 25, 30];
	
	// transform every value of valuesY and append it to emptylist
	for (var i = 0; i < valuesY.length; i++) {
		definiteY[i] = trans(valuesY[i]);
	};
	// List for plotting y values
	var lijst1 = definiteY;
	var lijst2 = valuesY;
	console.log(definiteY);

	// Assigning values for y and x axis
	drawText(test123, 0, canvas.height - offsetY, 20, -Math.PI/6, 1, 0, "1");
	drawText(lijst2, offsetX, 0, 15, 0, 2, 0, lijst1);


	// Function to fill background with dashed lines, using array[val =canvas coordinates]
	function setDash(array) {
		for (var i = 0; i < array.length; i++) {
			ctx.setLineDash([4, 16]);
			ctx.lineDashOffset = 2;
			drawline(offsetX, canvas.width - offsetX, array[i], array[i]);
		};
	};
	setDash(definiteY);

	// Function to create texts inside canvas environment
	function createText(pos_x, pos_y, fonttype, color, texttype, rotation) {
		ctx.save();
		ctx.fillStyle = color;
		ctx.font = fonttype;
		ctx.translate(pos_x, pos_y);
		ctx.textAlign = "center";
		ctx.rotate(rotation);
		ctx.fillText(texttype, 0, 0);
		ctx.restore();
	};

	// Initialize texts
	createText(25, canvas.height/2, "12px serif", "black", "Temperature (Celsius)", -Math.PI/2);
	createText(canvas.width/2, 350 + 40, "12px serif", "black", "Months", 0);
	createText(canvas.width/2, 40, "18px serif", "white", "Temperature at De Bilt in 2015", 0);