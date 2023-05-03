const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});


var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


//testing with dummy value, also this is just one sensor
//sensor_value_1 = 40;
//sensor_value_2 = 70;
//sensor_value_3 = 95;

function get_sensor_value(sensorName) {
  return 95;
}

const sensor_color_dict = { // change the keys to whatever name they have in the database
  'sensor1': 'progressbar1', 
  'sensor2': 'progressbar2', 
  'sensor3': 'progressbar3',
  'sensor4': 'progressbar4', 
  'sensor5': 'progressbar5', 
  'sensor6': 'progressbar6',
  'sensor7': 'progressbar7', 
  'sensor8': 'progressbar8', 
  'sensor9': 'progressbar9', 
  'sensor10': 'progressbar10', 
  'sensor11': 'progressbar11'
};

for (const [sensorName, progressName] of Object.entries(sensor_color_dict)) {
  var sensorValue = get_sensor_value(sensorName)
  var progressbar_color = document.getElementById(progressName + "-color");
  const color = get_progressbar_color(sensorValue); 
  progressbar_color.style.backgroundColor = color;

  var progressbar_text = document.getElementById(progressName + "-text"); 
  progressbar_text.innerHTML = get_progressbar_text(sensorValue); 

  var progressbar_span = document.getElementById(progressName + "-color");
  progressbar_span.style.width = sensorValue + "%";

}


// These functions return the color for the progress bar fill and what text to display
function get_progressbar_color(sensor_value) {
  if (sensor_value < 50) {
    return "#009E2C";
  } 
  else if (sensor_value >= 50 && sensor_value < 90) {
    return "#FD8900"; 
  } 
  else if (sensor_value >= 90) {
    return "#D40000"; 
  } 
  else {
    return "#000000"; 
  }
}

function get_progressbar_text(sensor_value) {
  if (sensor_value < 50) { // should it be a different message if the sensor registers a negative value (and something's probably wrong)?
    return "Det finns plats";
  } 
  else if (sensor_value >= 50 && sensor_value < 90) {
    return "Det finns lite plats"; 
  } 
  else if (sensor_value >= 90 && sensor_value <= 100) {
    return "Det är nästan fullt"; 
  } 
  else if (sensor_value > 100) {
    return "Det är överfullt"; 
  } 
}

//setting up the average progress bars

// create function that calculates the average of a set of sensor values. this average will determine span, color and text of averages progress bars. 
    // how can I create one fucntion that calculates the average for all 6 average progress bars?

// call get_progressbar_color() with the average value and color the average progress bars with the return value of the function

// call get_progressbar_text() with the average value and color the average progress bars with the return value of the function

