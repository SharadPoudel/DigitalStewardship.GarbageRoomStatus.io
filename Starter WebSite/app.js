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


// These functions return the color for the progress bar fill and what text to display
sensor_value = 50;

function progress_bar_color(sensor_value) {
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

function progress_bar_text(sensor_value) {
  if (sensor_value < 50) {
    return "Det finns plats";
  } 
  else if (sensor_value >= 50 && sensor_value < 90) {
    return "Det finns lite plats"; 
  } 
  else if (sensor_value >= 90 && sensor_value <= 100) {
    return "Det finns nästan ingen plats"; 
  } 
  else if (sensor_value > 100) {
    return "Det är överfullt"; 
  } 
}

// changing the color of the progress bar fill
const progressBar_color = document.getElementById('progress-bar-color'); 
const color = progress_bar_color(sensor_value); 
progressBar_color.style.backgroundColor = color;

// changing the text for the progress bar
let progressBar_text = document.getElementById("progress-bar-text");
progressBar_text.innerHTML = progress_bar_text(sensor_value); 

// changing the span for the progress bar
let progressBar_span = document.getElementById("progress-bar-color");
progressBar_span.style.width = sensor_value + "%";

