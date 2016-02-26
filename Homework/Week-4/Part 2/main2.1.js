// Name: Ruben Timmermans
// Student-id: 10434542
// Mail: ruben.timmermans@student.uva.nl

    var colors = [
            ["#fee5d9", Math.pow(10, 4)],
            ["#fcbba1", Math.pow(10, 5)],
            ["#fc9272", Math.pow(10, 6)],
            ["#fb6a4a", Math.pow(10, 7)],
            ["#de2d26", Math.pow(10, 8)],
            ["#a50f15", Math.pow(10, 9)]
        ];

    console.log(colors.length)
    // Function that sets color for a given value
    function setColor(val, list_data) {
        var color = "";
        for (var i = 0; i < list_data.length; i++) {
            if (val >= list_data[i][1]) {
                color = list_data[i][0];
            };
            if (val < list_data[0][1]) {
                color = "#bdbdbd";
            };
        };
        return String(color);
    };

    // Test
    console.log(setColor(120000, colors));

    // Function that shows data of inside an JSON object (written in JS)
    function showObject(object, name, data_1) {
        var len = object[name].length
        for (var i = 0; i < len; i++) {
            console.log(object[name][i][data_1].toLowerCase());
        };
    };

    // Test
    showObject(countries, "country", "population");

    /* 
     Function that uses JSON-object (,checks for null) and given functions to adjust the SVG
     Within the HTML file.
    */
    function adjustSVG(object, name, data_1, data_2, data_3, adjust_function1, adjust_function2) {
        for (var i = 0; i < object[name].length; i++) {
            //changeColor() Direct laten werken op svg bestand

            if (object[name][i][data_1] != null &&
                object[name][i][data_2] != null) {
                var change = adjust_function1(object[name][i][data_2], data_3);
                adjust_function2(object[name][i][data_1].toLowerCase(), change);
            };
        };   
    };

    adjustSVG(countries, "country", "countryCode", "population", colors, setColor, changeColor);
 
    // Function that adds a fill tag inside an HTML element if present
    function changeColor(id, color) {
        var country = document.getElementById(id);
        if (country != null) {
            //console.log(country);
            var att = document.createAttribute("fill");
            att.value = color;
            country.setAttributeNode(att);
        };
    };

    function changeBack(image) {
        var background = document.getElementById("back");
        background.setAttribute("background", image);
    };
