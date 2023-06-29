import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, query, setDoc, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// setting up the firebase to our project id
const firebaseConfig = {
  apiKey: "AIzaSyDZFmGewFYpK6aDnfjVltwK8bHE5x6___o",
  authDomain: "digitalstewardship.firebaseapp.com",
  projectId: "digitalstewardship",
  storageBucket: "digitalstewardship.appspot.com",
  messagingSenderId: "469552118705",
  appId: "1:469552118705:web:98fa6c5262ac8258d79b90"
};


// Initializing firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// Get bulky waste status from firebase by room number and display the banner if there is bulky waste. Check if the banner is already shown.
async function get_bulky_waste_status(roomnum) {

  var bulkyWasteReport = [];
  const q = query(collection(db, "reporting"));

  var warningBanner = document.getElementById("warning_banner" + roomnum);

  var warningIcon = document.getElementById("bulky_waste_warning_" + roomnum);

  warningBanner.style.display = 'none';
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {

    if (roomnum == doc.data().roomnum) {
      bulkyWasteReport.push(doc.data())
    }
  });

  const mostRecentEntry = bulkyWasteReport.sort((a, b) => {
    return b.timestamp - a.timestamp; 
  })[0];

  if (mostRecentEntry.status == true) {
    warningBanner.style.display = 'grid';
  
  }

  if (mostRecentEntry.status == true) {
    warningIcon.style.display = 'inline-block';
  }

  return mostRecentEntry.status;
}
get_bulky_waste_status(1);
get_bulky_waste_status(2);

// Get sensor value from firestore from a sensorid. Right now it just gets the last value - we need to figure out what value we want it to get. Maybe based on a timestamp or something.
async function get_sensor_value(sensornum) {

  var sensorValues = [];
  const q = query(collection(db, "sensordata"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {

    if (doc.data().sensorid == sensornum) {
      sensorValues.push(doc.data())
    }
  });

  const mostRecentEntry = sensorValues.sort((a, b) => {
    return b.timestamp - a.timestamp;
  })[0];

  if (mostRecentEntry === undefined) {
    return 50;
  }

  return mostRecentEntry.message;
};

setInterval(function() {
  location.reload();
}, 3600000);

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');

menu.addEventListener('click', function () {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});

//removing/adding the form and changing the heading in top-container-div on the wastepooling page on click
document.addEventListener('DOMContentLoaded', function() { //make the wastepooling top-container-div interactive once the DOM, or the HTML page has been loaded. this basically prevents the collapsible from being non-interactive
var inputs = document.querySelectorAll('.form-container input');
var form = document.querySelector('.form-container');
var button = document.querySelector('.top-container-div');
var heading = document.getElementById('form-heading');

//ensuring that clicking the input field doesn't close the whole form, aka setting the top-container-div display to none
for (var i = 0; i < inputs.length; i++) { 
  inputs[i].addEventListener('click', function (event) {
    event.stopPropagation();
  });
}

var FormVisible = false; 
// if top-container-div has been clicked, and if the form is not visible then set it to visible and cheange the h2 to "Ny artikel"
button.addEventListener('click', function (event) {
  if (!FormVisible) {
    heading.textContent = 'Ny artikel';
    form.style.display = 'inline-grid';
    FormVisible = true;
  } else { //if the top-container-div has been clicked, and the form is visible, then set the form to not visible and change the h2 
    heading.textContent = 'Har du något grovt avfall som behöver hämtas?';
    form.style.display = 'none';
    FormVisible = false;
  }
  event.stopPropagation(); //make sure this doesn't affect the parents
});
});


//this is for making the collapsible interactive
var collapsibles = document.getElementsByClassName("collapsible");
var collapsibleArrows = document.getElementsByClassName("collapsible_arrow");

for (var i = 0; i < collapsibles.length; i++) {
  collapsibles[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    var collapsibleArrow = this.querySelector(".collapsible_arrow");
    
    if (content.style.display === "block") {
      content.style.display = "none";
      collapsibleArrow.setAttribute("src", "images/collapsible_arrow_down.svg"); // set the source image to the down arrow
    } else {
      content.style.display = "block";
      collapsibleArrow.setAttribute("src", "images/collapsible_arrow_up.svg"); // set the source image to the up arrow
    }
  });
}

//here we start working on the progress bars

//dicts for each recycling room. these are dicts in dicts. in the first level key is waste type and value is sensor info. in the second level the key is the sensor name and the value is the ID in the HTML
var sensors_R6 = {
  'cardboard': { 'sensor1': 'progressbar1', 'sensor2': 'progressbar2', 'sensor3': 'progressbar3', 'sensor4': 'progressbar4', 'sensor5': 'progressbar5', 'sensor6': 'progressbar6' },
  'colored_glass': { 'sensor7': 'progressbar7', 'sensor8': 'progressbar8', 'sensor9': 'progressbar9' },
  'uncolored_glass': { 'sensor10': 'progressbar10', 'sensor11': 'progressbar11' }
};

var sensors_R7 = {
  'cardboard': { 'sensor12': 'progressbar12', 'sensor13': 'progressbar13', 'sensor14': 'progressbar14', 'sensor15': 'progressbar15', 'sensor16': 'progressbar16', 'sensor17': 'progressbar17' },
  'colored_glass': { 'sensor18': 'progressbar18', 'sensor19': 'progressbar19', 'sensor20': 'progressbar20' },
  'uncolored_glass': { 'sensor21': 'progressbar21', 'sensor22': 'progressbar22' }
};

var averages = {
  'cardboard': [],
  'colored_glass': [],
  'uncolored_glass': []
};

//progress_bar_setup() takes the sensor_dict (sensors_R6 or sensors_R7) and pane. pane is top (collapsible) or bottom (collapsible).
function progress_bar_setup(sensor_dict, pane) {

  //loop across the sensor_dict. keys are waste types and values are dict of sensors.
  for (const [typeName, sensors] of Object.entries(sensor_dict)) {
    //setup for each progress bar that corresponds to one sensor
    for (const [sensorName, progressName] of Object.entries(sensors)) { //loop across each value in sensor_dict which are dicts themselves.
      var value = get_sensor_value(sensorName);

      value.then(function (sensorValue) {
        // console.log(sensorValue);
        var progressbar_color = document.getElementById(pane + progressName + "-color");
        const color = get_progressbar_color(sensorValue);
        progressbar_color.style.backgroundColor = color; //color the progress bar
        averages[typeName].push(parseInt(sensorValue, 10));

        var progressbar_text = document.getElementById(pane + progressName + "-text");
        progressbar_text.innerHTML = get_progressbar_text(sensorValue); //set the text for the progress bar

        var progressbar_span = document.getElementById(pane + progressName + "-color");
        progressbar_span.style.width = sensorValue + "%"; //set the span of the progress bar

        set_average_progress(pane,typeName);
      });
    }
  }
}

//calculate a running average from the number of sensors read so far
function set_average_progress(pane,typeName)
{
  var values = averages[typeName];
  var total = values.reduce((a,b) => a+b);

  var sensorValue_average = total / values.length;
  var progressbar_color = document.getElementById(pane + typeName + "-average-color");
  const color = get_progressbar_color(sensorValue_average);
  progressbar_color.style.backgroundColor = color; //color the average progress bar

  var progressbar_text = document.getElementById(pane + typeName + "-average-text");
  progressbar_text.innerHTML = get_progressbar_text(sensorValue_average);//set the text for the average progress bar

  var progressbar_span = document.getElementById(pane + typeName + "-average-color");
  progressbar_span.style.width = sensorValue_average + "%"; //set the span for the average progress bar
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
    return "Finns plats";
  }
  else if (sensor_value >= 50 && sensor_value < 90) {
    return "Lite plats";
  }
  else if (sensor_value >= 90 && sensor_value <= 100) {
    return "Nästan fullt";
  }
  else if (sensor_value > 100) {
    return "Överfullt";
  }
}

//calling progress_bar_setup() twice so we set up both collapsibles
progress_bar_setup(sensors_R6, 'top_');
progress_bar_setup(sensors_R7, 'bottom_');



