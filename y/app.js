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

// Get sensor value from firestore from a sensorid. Right now it just gets the last value - we need to figure out what value we want it to get. Maybe based on a timestamp or something.
async function get_sensor_value(sensornum) {

  var value

  const q = query(collection(db, "sensordata"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {

    // allSensorValues = querySnapshot.docs.map(doc => doc.data());

    if (doc.data().sensorid == sensornum) {
      value = doc.data().message;
      value = value.split(" ") //remove when we have the right message
      value = value[3] //remove when we have the right message
      value = value.replace(/[^a-zA-Z0-9 ]/g, '') //remove when we have the right message
      value = parseInt(value); 
      console.log(value);
    }
  });

  return value;
}

var value = get_sensor_value('sensor1');


//value.then(function (result) {
  //console.log(result);
//});


const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

menu.addEventListener('click', function () {
  menu.classList.toggle('is-active');
  menuLinks.classList.toggle('active');
});




//this is for making the collapsible interactive
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
      document.getElementById("collapsible_arrow").src="collapsible_arrow_up.svg";
    } else {
      content.style.display = "block";
    }
  });
}

//here we start working on the progress bars

//dicts for each recycling room. these are dicts in dicts. in the first level key is waste type and value is sensor info. in the second level the key is the sensor name and the value is the ID in the HTML
var sensors_R6 = {
  'cardboard': { 'sensor1': 'progressbar1', 'sensor2': 'progressbar2', 'sensor3': 'progressbar3', 'sensor4': 'progressbar4', 'sensor5': 'progressbar5' },
  'colored_glass': { 'sensor6': 'progressbar6', 'sensor7': 'progressbar7', 'sensor8': 'progressbar8' },
  'uncolored_glass': { 'sensor9': 'progressbar9', 'sensor10': 'progressbar10', 'sensor11': 'progressbar11' }
};

var sensors_R7 = {
  'cardboard': { 'sensor12': 'progressbar12', 'sensor13': 'progressbar13', 'sensor14': 'progressbar14', 'sensor15': 'progressbar15', 'sensor16': 'progressbar16' },
  'colored_glass': { 'sensor17': 'progressbar17', 'sensor18': 'progressbar18', 'sensor19': 'progressbar19' },
  'uncolored_glass': { 'sensor20': 'progressbar20', 'sensor21': 'progressbar21', 'sensor22': 'progressbar22' }
};

//progress_bar_setup() takes the sensor_dict (sensors_R6 or sensors_R7) and pane. pane is top (collapsible) or bottom (collapsible). 
function progress_bar_setup(sensor_dict, pane) {
  var averages = {
    'cardboard': 0, //this dict will hold the average sensor value for each waste type
    'colored_glass': 0,
    'uncolored_glass': 0
  };

  //loop across the sensor_dict. keys are waste types and values are dict of sensors. 
  for (const [typeName, sensors] of Object.entries(sensor_dict)) {
    //setup for each progress bar that corresponds to one sensor
    for (const [sensorName, progressName] of Object.entries(sensors)) { //loop across each value in sensor_dict which are dicts themselves. 
      var value = get_sensor_value(sensorName);

      value.then(function (sensorValue) {
        console.log(sensorValue);
        var progressbar_color = document.getElementById(pane + progressName + "-color");
        const color = get_progressbar_color(sensorValue);
        progressbar_color.style.backgroundColor = color; //color the progress bar
        averages[typeName] = averages[typeName] + sensorValue; //add the sensor value to averages dict so we have a total value per waste type

        var progressbar_text = document.getElementById(pane + progressName + "-text");
        progressbar_text.innerHTML = get_progressbar_text(sensorValue); //set the text for the progress bar

        var progressbar_span = document.getElementById(pane + progressName + "-color");
        progressbar_span.style.width = sensorValue + "%"; //set the span of the progress bar
    
    });

    }
    averages[typeName] = averages[typeName] / Object.keys(sensors).length; // calculate the average sensor value per waste type
  }

  //setup for progress bars with averages
  for (const [typeName, sensorValue_average] of Object.entries(averages)) { //loop across the averages dict
    var progressbar_color = document.getElementById(pane + typeName + "-average-color");
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



