const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function() {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});


//this is for making the collapsible interactive
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

//here we start working on the progress bars

//the sensorName comes from the dict. the sensor names should be the same as they are in the database. 
function get_sensor_value(sensorName) { 
  return 45;
}

//dicts for each recycling room. these are dicts in dicts. in the first level key is waste type and value is sensor info. in the second level the key is the sensor name and the value is the ID in the HTML
var sensors_R6 = { 'cardboard' : { 'sensor1' : 'progressbar1', 'sensor2' : 'progressbar2', 'sensor3' : 'progressbar3', 'sensor4' : 'progressbar4', 'sensor5' : 'progressbar5'},
               'colored_glass' : { 'sensor6' : 'progressbar6', 'sensor7' : 'progressbar7', 'sensor8' : 'progressbar8' },
               'uncolored_glass': { 'sensor9' : 'progressbar9', 'sensor10' : 'progressbar10', 'sensor11' : 'progressbar11' }
                 };

var sensors_R7 = { 'cardboard' : { 'sensor12' : 'progressbar12', 'sensor13' : 'progressbar13', 'sensor14' : 'progressbar14', 'sensor15' : 'progressbar15', 'sensor16' : 'progressbar16'},
                 'colored_glass' : { 'sensor17' : 'progressbar17', 'sensor18' : 'progressbar18', 'sensor19' : 'progressbar19' },
                 'uncolored_glass': { 'sensor20' : 'progressbar20', 'sensor21' : 'progressbar21', 'sensor22' : 'progressbar22' }
                 };
           
//progress_bar_setup() takes the sensor_dict (sensors_R6 or sensors_R7) and pane. pane is top (collapsible) or bottom (collapsible). 
function progress_bar_setup(sensor_dict, pane)
{
  var averages = { 'cardboard': 0, //this dict will hold the average sensor value for each waste type
              'colored_glass': 0,
              'uncolored_glass': 0
           };

  //loop across the sensor_dict. keys are waste types and values are dict of sensors. 
  for (const [typeName, sensors] of Object.entries(sensor_dict)) {
    //setup for each progress bar that corresponds to one sensor
    for (const [sensorName, progressName] of Object.entries(sensors)) { //loop across each value in sensor_dict which are dicts themselves. 
        var sensorValue = get_sensor_value(sensorName);

        var progressbar_color = document.getElementById(pane + progressName + "-color");
        const color = get_progressbar_color(sensorValue); 
        progressbar_color.style.backgroundColor = color; //color the progress bar
        averages[typeName] = averages[typeName] + sensorValue; //add the sensor value to averages dict so we have a total value per waste type

        var progressbar_text = document.getElementById(pane + progressName+ "-text");
        progressbar_text.innerHTML = get_progressbar_text(sensorValue); //set the text for the progress bar

        var progressbar_span = document.getElementById(pane + progressName + "-color");
        progressbar_span.style.width = sensorValue + "%"; //set the span of the progress bar
    }
    averages[typeName] = averages[typeName] / Object.keys(sensors).length; // calculate the average sensor value per waste type
  }

  //setup for progress bars with averages
  for (const [typeName, sensorValue_average] of Object.entries(averages)) { //loop across the averages dict
      var progressbar_color = document.getElementById(pane + typeName+ "-average-color");
      const color = get_progressbar_color(sensorValue_average); 
      progressbar_color.style.backgroundColor = color; //color the average progress bar

      var progressbar_text = document.getElementById(pane + typeName + "-average-text"); 
      progressbar_text.innerHTML = get_progressbar_text(sensorValue_average);//set the text for the average progress bar

      var progressbar_span = document.getElementById(pane + typeName + "-average-color"); 
      progressbar_span.style.width = sensorValue_average + "%"; //set the span for the average progress bar
    }
}


// get_progressbar_color() returns the color for the progress bar
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

//get_progressbar_text() returns the text for the progress bar 
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

//calling progress_bar_setup() twice so we set up both collapsibles
progress_bar_setup(sensors_R6,'top_');
progress_bar_setup(sensors_R7,'bottom_');



