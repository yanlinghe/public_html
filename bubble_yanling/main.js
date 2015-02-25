
var UP_SAMPLING_RATIO = 1;
var BOUNDING_BOX = window.innerWidth * UP_SAMPLING_RATIO;
var FROM_OPACITY = 0;
var TO_OPACITY = Math.random();
var BACKGROUND_OPACITY = 1-TO_OPACITY;
var TOTAL_NUM = 10;


window.onload = function(){
	load_from(function(from,image_el){

		var background = draw_background(image_el);
		var to = draw_to();
		var line_pattern = ["random", "up", "down", "left", "right", "center", "corner"][Math.floor(Math.random()*7)];
		
		// create brushes
		ibrush = create_brush(BRUSH, to);
		for (i = 0; i < TOTAL_NUM; i++) {
			// arguments can be random, up, down, left, right, center, corner
			to.curves.push({brush: ibrush, path: create_path(PATH, to, line_pattern)})
		}

		start_tracing(to,from,background);
		window.addEventListener("keydown", function(e){
		    if(e.keyCode === 72) {
		        load_image("/00"+Math.floor(Math.random()*16 + 10)+".jpg",from)
		    }
		});
	});
}

function load_image(src,context_from){
	var image_from = new Image();
	image_from.onload = function() {
	  context_from.drawImage(this, 0, 0, document.getElementById('from').width, document.getElementById('from').height);
	};
	console.log(src);
	image_from.src = src;
}

function create_brush(brush,context){
	return new brush(context);
}

function create_path(path,context,showType){
	return new path(context,showType);
}

function get_pattern(image_el) {
 	var pattern_canvas = document.createElement('canvas');
 	pattern_canvas.height = BOUNDING_BOX;
	pattern_canvas.width = BOUNDING_BOX;
	pattern_canvas.style.height = pattern_canvas.height / UP_SAMPLING_RATIO;
	pattern_canvas.style.width = pattern_canvas.width / UP_SAMPLING_RATIO;
	var pattern_context = pattern_canvas.getContext('2d');
	pattern_context.drawImage(image_el, 0, 0, pattern_canvas.width, pattern_canvas.height);
	return pattern_canvas;
}

function draw_background(image_el){
	var canvas_background = document.getElementById('background');
	canvas_background.style.opacity = BACKGROUND_OPACITY;
	canvas_background.height = BOUNDING_BOX;
	canvas_background.width = BOUNDING_BOX; 
	canvas_background.style.height = canvas_background.height / UP_SAMPLING_RATIO;
	canvas_background.style.width = canvas_background.width / UP_SAMPLING_RATIO;
	var context_background = canvas_background.getContext('2d');
	context_background.lineJoin = context_background.lineCap = 'round';
	// we might want to just use image as the pattern
	context_background.strokeStyle = context_background.createPattern(get_pattern(image_el),'no-repeat');
	context_background.fillStyle = context_background.createPattern(get_pattern(image_el),'no-repeat');
	return context_background;
}

function load_from(callback){
	var canvas_from = document.getElementById('from');
	canvas_from.style.opacity = FROM_OPACITY;
	canvas_from.height = BOUNDING_BOX;
	canvas_from.width = BOUNDING_BOX;
	canvas_from.style.height = canvas_from.height / UP_SAMPLING_RATIO;
	canvas_from.style.width = canvas_from.width / UP_SAMPLING_RATIO;
	var context_from = canvas_from.getContext('2d');
	var image_from = new Image();
	image_from.onload = function() {
	  context_from.drawImage(this, 0, 0, canvas_from.width, canvas_from.height);
	  callback(context_from,this);
	};
	image_from.src = "/00"+Math.floor(Math.random()*16 + 10)+".jpg";
}

function draw_to(){
	var canvas_to = document.getElementById('to');
	canvas_to.style.opacity = TO_OPACITY;
	canvas_to.height = BOUNDING_BOX;
	canvas_to.width = BOUNDING_BOX; 
	canvas_to.style.height = canvas_to.height / UP_SAMPLING_RATIO;
	canvas_to.style.width = canvas_to.width / UP_SAMPLING_RATIO;
	var context_to = canvas_to.getContext('2d');
	context_to.curves = [];
	return context_to;
}

// different brush

// base shape (dot, shape, texture (transparency))
// base color fn(origin canvas) +fn(shiting)
// relationship with previous path 
// brush speed factor, inertia 
// parallel drawing

// genelized and parameterized brush
// dedicated options (toggle)

// Temperature: calm (blurry) <> energetic (clarity)
// Wind: still (clear) <> chill <> moving <> blast (noisy, distorted)
// Humidity: dry (clear like) <> moist <>raining (old film , low contrast like)
// Sun: night (lack of color and tone) <> dawn <> noon <> bright <> sunset (more colorful vibrant)
// Cloud: clear (high contrast) <> cloudy <> blocked (low contrast)
// Season and time:  cold (low color temperature, winter) <> warm (high color temperature, spring)

// tracing pattern

function start_tracing(context_to,context_from,context_background){
	// var line_width;
	// var windChillSlider = document.getElementById('wind_chill')
	// var windDirectionSlider = document.getElementById('wind_direction')
	// var windSpeedSlider = document.getElementById('wind_speed')
	// var atmosHumiditySlider = document.getElementById('atmos_humidity')
	// var atmosVisibilitySlider = document.getElementById('atmos_visibility')
	// var atmosPressureSlider = document.getElementById('atmos_pressure')
	// var atmosRisingSlider = document.getElementById('atmos_rising')
	// var codeSlider = document.getElementById('code')
	// var tempSlider = document.getElementById('temp')
	// var daySlider = document.getElementById('day')
	// var timeSlider = document.getElementById('time')

	// var windChill = windChillSlider.value;
	// var windDirection = windDirectionSlider.value;
	// var windSpeed = windSpeedSlider.value;
	// var atmosHumidity = atmosHumiditySlider.value;
	// var atmosVisibility = atmosVisibilitySlider.value;
	// var atmosPressure = atmosPressureSlider.value;
	// var atmosRising = atmosRisingSlider.value;
	// var code = codeSlider.value;
	// var temp = tempSlider.value;
	// var day = daySlider.value;
	// var time = timeSlider.value;
	// var angle = windDirection / 360.0 * Math.PI; 

	// windChillSlider.oninput = function() { windChill = this.value; }
	// windDirectionSlider.oninput = function() { windDirection = this.value 
	// angle = windDirection / 360.0 * Math.PI; }
	// windSpeedSlider.oninput = function() { windSpeed = this.value }
	// atmosHumiditySlider.oninput = function() { atmosHumidity = this.value }
	// atmosVisibilitySlider.oninput = function() { atmosVisibility = this.value }
	// atmosPressureSlider.oninput = function() { atmosPressure = this.value }
	// atmosRisingSlider.oninput = function() { atmosRising = this.value }
	// codeSlider.oninput = function() { code = this.value }
	// tempSlider.oninput = function() { temp = this.value }
	// daySlider.oninput = function() { day = this.value }
	// timeSlider.oninput = function() { time = this.value }

    var color = [0,0,0];
    var total_color = [0,0,0];
    var counter = 0;
    var w=1.0;
    var draw_pattern = ["angular", "spiral", "random", "bounce", "line"][Math.floor(Math.random()*5)];

	//setInterval(function(){
	// we don't use setInterval and use request animation frame instead to save battery
	// http://ie.microsoft.com/testdrive/graphics/RequestAnimationFrame/Default.html
	var animate = function(){
		// pick color brush color
		// total_color = [0,0,0];
		// counter = 0;

		for (i in context_to.curves) {
			color = context_from.getImageData(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, 1, 1).data;			
			
			total_color[0]+=color[0];
			total_color[1]+=color[1];
			total_color[2]+=color[2];
			counter += 1;

			context_to.curves[i].brush.stroke(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, "shaded", color, 1, 0.2, 3000);
			//wave, angular, spiral, random, bounce, line
			context_to.curves[i].path.update(draw_pattern);


			context_background.globalAlpha = Math.random();
			context_background.lineWidth = Math.random()*counter/200;
			context_background.beginPath();
		  	context_background.arc(context_to.curves[i].path.cur_pos.x, context_to.curves[i].path.cur_pos.y, Math.random()*counter/50, 0, 2 * Math.PI, true);
			// context_background.moveTo(199,199);
			// context_background.lineTo(200,200);
			context_background.stroke();
			
		}
		document.getElementById("bg").style.background = "rgba(" + Math.floor(total_color[0]/counter) + ", " + Math.floor(total_color[1]/counter) + ", " + Math.floor(total_color[2]/counter) + ", 1)";
		//console.log(document.getElementById("bg").style.background)
		window.requestAnimationFrame(animate);
	}
	window.requestAnimationFrame(animate);
	//},1000/60);

}




