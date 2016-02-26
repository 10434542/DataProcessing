/* use this to test out your function */
window.onload = function() {
 	// changeColor();
 	changeColor("no", "black");
 	changeColor("ua", "purple");
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {

	var country = document.getElementById(id);
	country.setAttribute("fill", color);     
}

